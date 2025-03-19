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
        fields = ["id", "owner", "name"]


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "owner", "name", "description"]


class BookmarkSerializer(serializers.ModelSerializer):
    bookmarks_with_tag = TagSerializer(many=True, read_only=True)
    # collection = serializers.SlugRelatedField(read_only=True, slug_field="name")

    class Meta:
        model = Bookmark
        fields = "__all__"
