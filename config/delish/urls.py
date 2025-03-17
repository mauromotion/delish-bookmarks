from django.urls import include, path

from . import views

urlpatterns = [
    path("login", views.login),
    path("register", views.register),
    path("test_token", views.test_token),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("bookmarks/", views.bookmark_list),
]
