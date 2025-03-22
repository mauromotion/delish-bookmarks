from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

import delish.utils.scraping as scraping
from delish.models import Bookmark, Collection, Tag

from .serializers import (
    BookmarkCreateSerializer,
    BookmarkListSerializer,
    CollectionSerializer,
    TagSerializer,
    UserSerializer,
)

User = get_user_model()


## Authentication ##


@api_view(["POST"])
def login(request):
    serializer = TokenObtainPairSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user_serializer = UserSerializer(serializer.user)
    return Response(
        {
            "access": serializer.validated_data["access"],
            "refresh": serializer.validated_data["refresh"],
            "user": user_serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data["password"])
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


## API ##
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
        return Bookmark.objects.filter(owner=user)

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
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Tag.objects.all()
        return Tag.objects.filter(owner=user)


# Delete or modify a tag of the current user
class TagDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Tag.objects.all()
        return Tag.objects.filter(owner=user)


# Retrieve all the collections created by the current user, create new collections
class CollectionListAPIView(generics.ListCreateAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Collection.objects.all()
        return Collection.objects.filter(owner=user)


# Delete or modify a collection of the current user
class CollectionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Collection.objects.all()
        return Collection.objects.filter(owner=user)
