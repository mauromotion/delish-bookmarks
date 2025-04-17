from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import delish.utils.scraping as scraping
from delish.models import Bookmark, Collection

from .serializers import (
    BookmarkCreateSerializer,
    BookmarkListSerializer,
    CollectionSerializer,
    TagCreateSerializer,
    TagListSerializer,
)


# Sanity check
@api_view(["GET"])
def api_root(request):
    return Response({"message": "API Satus: OK"})


# Retrieve all the bookmarks of the current user, POST a new bookmark
class BookmarkListAPIView(generics.ListCreateAPIView):
    serializer_class = BookmarkListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Bookmark.objects.filter(owner=user)
        params = self.request.query_params

        # Define search queries
        all_query = params.get("q")
        collection_query = params.get("collection")
        tag_query = params.get("tag")
        is_archived = params.get("is_archived")
        is_unread = params.get("is_unread")

        # Default query for all bookmarks (just for consisentcy at the moment)
        if all_query:
            queryset = Bookmark.objects.filter(owner=user)
        # Filter by collection
        if collection_query:
            queryset = queryset.filter(
                collection__owner=user, collection__name=collection_query
            )

        # Filter by tags
        if tag_query:
            queryset = queryset.filter(tags__owner=user, tags__name=tag_query)

        # Filter by archived
        if is_archived and is_archived.lower() in ("true", "1"):
            queryset = queryset.filter(is_archived=True)

        # Fitler by unread
        if is_unread and is_unread.lower() in ("true", "1"):
            queryset = queryset.filter(is_unread=True)

        # WARN: I could off load the sorting to the back end here by using '.order_by("-timestamp")'
        return queryset

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BookmarkCreateSerializer
        return BookmarkListSerializer

    # Create new bookmark
    def perform_create(self, serializer):
        collection_name = self.request.data.get("collection")
        if collection_name == "Unsorted":
            collection = Collection.objects.get(
                owner=self.request.user, name="Unsorted"
            )
        else:
            collection = Collection.objects.get(
                owner=self.request.user, name=collection_name
            )

        bookmark = serializer.save(owner=self.request.user, collection=collection)

        bookmark.save()

        # Enqueue async tasks to complete bookmark fields.
        scraping.get_title(bookmark.id)
        scraping.get_description(bookmark.id)
        scraping.get_favicon(bookmark.id)


# Delete or modify a bookmark of the current user
class BookmarkDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookmarkListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Bookmark.objects.filter(owner=user)


# Retrieve all the tags created by the current user, post new tags
class TagListAPIView(generics.ListCreateAPIView):
    serializer_class = TagListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return user.tags.all()


# Delete or modify a tag of the current user
class TagDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return user.tags.all()


# Retrieve all the collections created by the current user, create new collections
class CollectionListAPIView(generics.ListCreateAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return user.collections.all()


# Delete or modify a collection of the current user
class CollectionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return user.collections.all()
