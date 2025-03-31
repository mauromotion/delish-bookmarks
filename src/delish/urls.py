from django.urls import include, path

from . import views
from .authentication import (
    MyTokenObtainPairView,
    login,
    logout,
    refresh_token,
    register,
)

urlpatterns = [
    path("", views.api_root),
    path("login", login),
    path("logout", logout),
    path("register", register),
    path("api/token", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh", refresh_token, name="token_refresh"),
    path("api-auth", include("rest_framework.urls", namespace="rest_framework")),
    path("bookmarks", views.BookmarkListAPIView.as_view(), name="user-bookmarks"),
    path("bookmarks/<int:pk>", views.BookmarkDetailAPIView.as_view()),
    path("tags", views.TagListAPIView.as_view(), name="user-tags"),
    path("tags/<int:pk>", views.TagDetailAPIView.as_view()),
    path("collections", views.CollectionListAPIView.as_view(), name="user-collections"),
    path("collections/<int:pk>", views.CollectionDetailAPIView.as_view()),
]
