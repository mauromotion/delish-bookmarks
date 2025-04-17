from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if this is a new user being created
        super().save(*args, **kwargs)

        # Create Unsorted collection for new users after they've been saved
        if is_new:
            from .models import Collection  # Import here to avoid circular imports

            Collection.objects.create(owner=self, name="Unsorted")


class Collection(models.Model):
    owner = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="collections"
    )
    name = models.CharField(max_length=50, default="Unsorted")
    description = models.TextField(default="", blank=True)

    def delete(self, *args, **kwargs):
        # Don't allow deletion of the "Unsorted" collection
        if self.name == "Unsorted":
            return False

        # Find the Unsorted collection for the current user
        unsorted = Collection.objects.get(owner=self.owner, name="Unsorted")

        # Move all bookmarks from this collection to Unsorted
        Bookmark.objects.filter(collection=self).update(collection=unsorted)

        # Now proceed with the deletion
        return super().delete(*args, **kwargs)

    # Create the "Unsorted" default collection at initialization
    def save(self, *args, **kwargs):
        if not self.pk and not Collection.objects.filter(owner=self.owner).exists():
            # Create a default collection if it's the user's first one
            self.name = "Unsorted"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tags")
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Bookmark(models.Model):
    owner = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="bookmarks"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    url = models.URLField()
    title = models.CharField(max_length=150, default="", blank=True)
    description = models.CharField(max_length=250, default="", blank=True)
    favicon = models.URLField(default="", blank=True)
    note = models.TextField(default="", blank=True)
    collection = models.ForeignKey(
        "Collection",
        on_delete=models.DO_NOTHING,
        related_name="bookmarks_in_collection",
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="bookmarks_with_tag")
    is_unread = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"Bookmark {self.id} saved by {self.owner} on {self.timestamp.strftime('%b %d %Y, %I:%M %p')}"
