from django.contrib import admin

from delish.models import Bookmark, Collection, Tag, User

admin.site.register(User)


class BookmarkAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "timestamp",
        "url",
        "title",
        "description",
        "favicon",
        "note",
        "collection",
        "display_tags",
        "is_unread",
        "is_archived",
    )

    # Get the list of tags and joined them as a string
    def display_tags(self, obj):
        return ", ".join(tag.name for tag in obj.tags.all())

    display_tags.short_description = "Tags"


admin.site.register(Bookmark, BookmarkAdmin)


class CollectionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "description")


admin.site.register(Collection, CollectionAdmin)


class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name")


admin.site.register(Tag, TagAdmin)
