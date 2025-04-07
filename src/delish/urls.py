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
    path("api/login", login),
    path("api/logout", logout),
    path("api/register", register),
    path("api/token", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh", refresh_token, name="token_refresh"),
    path("api-auth", include("rest_framework.urls", namespace="rest_framework")),
    path("api/bookmarks", views.BookmarkListAPIView.as_view(), name="user-bookmarks"),
    path("api/bookmarks/<int:pk>", views.BookmarkDetailAPIView.as_view()),
    path("api/tags", views.TagListAPIView.as_view(), name="user-tags"),
    path("api/tags/<int:pk>", views.TagDetailAPIView.as_view()),
    path(
        "api/collections",
        views.CollectionListAPIView.as_view(),
        name="user-collections",
    ),
    path("api/collections/<int:pk>", views.CollectionDetailAPIView.as_view()),
]
