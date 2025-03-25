from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import delish.utils.scraping as scraping
from delish.models import Bookmark, Collection, Tag

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
        if user.is_staff:
            return Bookmark.objects.all()
        return user.bookmarks.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BookmarkCreateSerializer
        return BookmarkListSerializer

    def perform_create(self, serializer):
        unsorted_collection = Collection.objects.get(
            owner=self.request.user, name="Unsorted"
        )
        bookmark = serializer.save(
            owner=self.request.user, collection=unsorted_collection
        )

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
        if user.is_staff:
            return Bookmark.objects.all()
        return Bookmark.objects.filter(owner=user)


# Retrieve all the tags created by the current user, post new tags
class TagListAPIView(generics.ListCreateAPIView):
    serializer_class = TagListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Tag.objects.all()
        return user.tags.all()


# Delete or modify a tag of the current user
class TagDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Tag.objects.all()
        return user.tags.all()


# Retrieve all the collections created by the current user, create new collections
class CollectionListAPIView(generics.ListCreateAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Collection.objects.all()
        return user.collections.all()


# Delete or modify a collection of the current user
class CollectionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Collection.objects.all()
        return user.collections.all()
