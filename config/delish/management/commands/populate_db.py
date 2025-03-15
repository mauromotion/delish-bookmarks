import datetime

from delish.models import Bookmark, Collection, Tag, User
from django.core.management.base import BaseCommand
from django.utils import lorem_ipsum


class Command(BaseCommand):
    help = "Populates the db for development porpouses"

    def handle(self, *args, **kwargs):
        # get or create superuser
        admin = User.objects.filter(username="admin").first()
        if not admin:
            admin = User.objects.create_superuser(
                username="admin", password="arigato80"
            )

        # get or create user1
        user = User.objects.filter(username="user1").first()
        if not user:
            user = User.objects.create_user(username="user1", password="password")

        # create "Unsorted" collection
        Collection.objects.create(user=user, name="Unsorted", description="")

        # add bookmarks
        bookmarks = [
            Bookmark(
                user=user,
                timestamp=datetime.datetime.now().timestamp(),
                url="https://penpot.app",
                title="Penpot",
                description=lorem_ipsum.sentence(),
                favicon="https://design.penpot.app/images/favicon.png",
                collection=Collection.objects.get(user=user, name="Unsorted"),
            )
        ]

        Bookmark.objects.bulk_create(bookmarks)
