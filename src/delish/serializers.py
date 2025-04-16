from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Bookmark, Collection, Tag

User = get_user_model()


# Customise the information inside the encrypted token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom fields
        token["username"] = user.username
        # ...

        return token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta(object):
        model = User
        fields = ["id", "username", "password", "email"]


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="This email address is already registered.",
            )
        ]
    )
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="This username is already taken."
            )
        ]
    )
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class TagListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "owner", "name"]


class TagCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "owner", "name"]
        read_only_fields = ["owner"]


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "owner", "name", "description"]
        unique_together = ("owner", "name")


class BookmarkListSerializer(serializers.ModelSerializer):
    tags = TagListSerializer(many=True, read_only=True)
    collection = serializers.SlugRelatedField(
        slug_field="name", queryset=Collection.objects.all()
    )

    class Meta:
        model = Bookmark
        fields = "__all__"


class BookmarkCreateSerializer(serializers.ModelSerializer):
    tags = TagListSerializer(many=True, read_only=True)
    collection = serializers.SlugRelatedField(
        slug_field="name", queryset=Collection.objects.all()
    )

    class Meta:
        model = Bookmark
        read_only_fields = ["owner"]
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            self.fields["collection"].queryset = Collection.objects.filter(
                owner=request.user
            )
            if "tags" in self.fields:
                self.fields["tags"].queryset = Tag.objects.filter(owner=request.user)
