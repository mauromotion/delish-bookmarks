from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Bookmark, Collection, Tag

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ["id", "username", "password", "email"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection


class BookmarkSerializer(serializers.ModelSerializer):
    bookmarks_with_tag = TagSerializer(many=True, read_only=True)
    tags = bookmarks_with_tag

    class Meta:
        model = Bookmark
        fields = (
            "user",
            "timestamp",
            "url",
            "title",
            "description",
            "favicon",
            "note",
            "collection",
            "tags",
            "is_unread",
            "is_archived",
        )
