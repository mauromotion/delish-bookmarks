from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Collection(models.Model):
    owner = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="collections"
    )
    name = models.CharField(max_length=50, default="Unsorted")
    description = models.TextField(default="", blank=True)

    # Create the "Unsorted" default collection at initialization
    def save(self, *args, **kwargs):
        if not self.pk and not Collection.objects.filter(owner=self.owner).exists():
            # Create a default collection if it's the user's first one
            self.name = "Unsorted"
        super().save(*args, **kwargs)


class Tag(models.Model):
    owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tags")
    name = models.CharField(max_length=50)


class Bookmark(models.Model):
    owner = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="bookmarks"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    url = models.URLField(default="", blank=True)
    title = models.CharField(max_length=50, default="")
    description = models.CharField(max_length=100, default="", blank=True)
    favicon = models.URLField(default="", blank=True)
    note = models.TextField(default="", blank=True)
    collection = models.ForeignKey(
        "Collection",
        on_delete=models.DO_NOTHING,
        related_name="bookmarks_in_collection",
        default="Unsorted",
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="bookmarks_with_tag")
    is_unread = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"Bookmark {self.id} saved by {self.owner} on {self.timestamp.strftime('%b %d %Y, %I:%M %p')}"
