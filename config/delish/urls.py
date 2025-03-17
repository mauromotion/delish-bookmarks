from django.urls import path

from . import views

urlpatterns = [
    path("login", views.login),
    path("register", views.register),
    path("test_token", views.test_token),
    path("bookmarks/", views.bookmark_list),
]
