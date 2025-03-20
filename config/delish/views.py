from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import delish.utils.scraping as scraping
from delish.models import Bookmark, Collection, Tag

from .serializers import (
    BookmarkSerializer,
    CollectionSerializer,
    TagSerializer,
    UserSerializer,
)

User = get_user_model()


## Authentication ##


@api_view(["POST"])
def login(request):
    user = get_object_or_404(User, username=request.data["username"])
    if not user.check_password(request.data["password"]):
        return Response({"detail": "Not found."}, status=status.HTTP_400_BAD_REQUEST)

    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})


@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data["username"])

        # Hash the user's password before storing it
        user.set_password(request.data["password"])
        user.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.email))


## API ##
# Sanity check
@api_view(["GET"])
def api_root(request):
    return Response({"message": "API Satus: OK"})


# Retrieve all the bookmarks of the current user, POST a new bookmark
class BookmarkListAPIView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Bookmark.objects.all()
        return Bookmark.objects.filter(owner=user)


# Delete or modify a bookmark of the current user
class BookmarkDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookmarkSerializer
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
