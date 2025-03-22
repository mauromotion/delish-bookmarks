import datetime

from delish.models import Bookmark, Collection, Tag, User
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand
from django.utils import lorem_ipsum


class Command(BaseCommand):
    help = "Populates the db for development porpouses"

    # get or create superuser
    def handle(self, *args, **kwargs):
        admin = User.objects.filter(username="admin").first()
        if not admin:
            admin = User.objects.create_superuser(
                username="admin", password="arigato80", email="admin@email.com"
            )

        # get or create user1
        user1 = User.objects.filter(username="user1").first()
        if not user1:
            user1 = User.objects.create_user(
                username="user1", password="password", email="user1@mail.com"
            )

        # get or create user2
        user2 = User.objects.filter(username="user2").first()
        if not user2:
            user2 = User.objects.create_user(
                username="user2", password="password", email="user2@mail.com"
            )

        # create "Unsorted" collections
        collection1 = Collection.objects.create(owner=user1, name="", description="")
        collection2 = Collection.objects.create(owner=user2, name="", description="")

        # add bookmarks
        bookmarks = [
            Bookmark(
                owner=user1,
                # timestamp=datetime.datetime.now().timestamp(),
                url="https://penpot.app",
                title="Penpot",
                description=lorem_ipsum.words(5),
                favicon="https://design.penpot.app/images/favicon.png",
                collection=collection1,
            ),
            Bookmark(
                owner=user1,
                # timestamp=datetime.datetime.now().timestamp(),
                url="https://natureofcode.com/",
                title="Nature of Code",
                description=lorem_ipsum.words(5),
                favicon="https://natureofcode.com/favicon-32x32.png?v=319318ad5e66d70aef2b73df0585a3e8",
                collection=collection1,
            ),
            Bookmark(
                owner=user2,
                # timestamp=datetime.datetime.now().timestamp(),
                url="https://www.django-rest-framework.org",
                title="Django REST Framework",
                description=lorem_ipsum.words(5),
                favicon="https://www.django-rest-framework.org/img/favicon.ico",
                collection=collection2,
            ),
            Bookmark(
                owner=user2,
                # timestamp=datetime.datetime.now().timestamp(),
                url="https://selfh.st/",
                title="Self-hosted content and software",
                description=lorem_ipsum.words(5),
                favicon="https://selfh.st/content/images/size/w256h256/2023/09/favicon-1.png",
                collection=collection2,
            ),
        ]

        for bookmark in bookmarks:
            try:
                bookmark.full_clean()  # Validate the bookmark instance
                bookmark.save()
                self.stdout.write(
                    self.style.SUCCESS(f"Bookmark '{bookmark.title}' saved.")
                )
            except ValidationError as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Validation error for '{bookmark.title}': {e.message_dict}"
                    )
                )
