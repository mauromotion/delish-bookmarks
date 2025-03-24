from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

import delish.utils.scraping as scraping
from delish.models import Bookmark, Collection, Tag

from .serializers import (
    BookmarkCreateSerializer,
    BookmarkListSerializer,
    CollectionSerializer,
    MyTokenObtainPairSerializer,
    TagCreateSerializer,
    TagListSerializer,
    UserSerializer,
)

## Authentication ##


# Customised TokenObtainPairView class with added "username"
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def login(request):
    serializer = MyTokenObtainPairSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user_serializer = UserSerializer(serializer.user)

    # Build a response with the access token and user data.
    response = Response(
        {
            "access": serializer.validated_data["access"],
            "user": user_serializer.data,
        },
        status=status.HTTP_200_OK,
    )

    # Get the refresh token from the serializer
    refresh_token = serializer.validated_data["refresh"]

    # Set the refresh token in an http‑only cookie.
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,  # use secure=True in production (requires HTTPS)
        samesite="Strict",  # or 'Lax' based on your requirements
        max_age=30 * 24 * 3600,
    )

    return response


@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data["password"])
        user.save()
        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "access": str(refresh.access_token),
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,  # Prevents JS access to the cookie
            secure=True,  # Use HTTPS in production
            samesite="Strict",  # Adjust based on your requirements
            max_age=30 * 24 * 3600,  # 30 days in seconds
        )
        return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def refresh_token(request):
    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
        return Response(
            {"error": "Refresh token not found"}, status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        # Validate the refresh token
        token = RefreshToken(refresh_token)
        # Create a new access token
        new_access_token = str(token.access_token)

        return Response({"access": new_access_token}, status=status.HTTP_200_OK)

    except InvalidToken:
        return Response(
            {"error": "Expired or invalid refresh token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    except TokenError:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


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
