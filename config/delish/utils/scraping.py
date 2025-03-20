import favicon
import requests
from bs4 import BeautifulSoup
from huey.contrib.djhuey import db_task
from urltitle import URLTitleReader

from delish.models import Bookmark


# Get the title
@db_task()
def get_title(bookmark_id):
    try:
        bookmark = Bookmark.objects.get(id=bookmark_id)
    except Bookmark.DoesNotExist:
        return

    try:
        reader = URLTitleReader(verify_ssl=True)
        title = reader.title(bookmark.url)
        bookmark.title = title
        bookmark.save()
    except Exception:
        pass


# Get the favicon
@db_task()
def get_favicon(bookmark_id):
    try:
        bookmark = Bookmark.objects.get(id=bookmark_id)
    except Bookmark.DoesNotExist:
        return
    try:
        user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36"
        headers = {"User-Agent": user_agent}

        favicon_check = favicon.get(bookmark.url, headers=headers, timeout=2)
        if favicon_check:
            url_favicon = favicon_check[0].url
            bookmark.favicon = url_favicon
            bookmark.save()
    except requests.exceptions.RequestException:
        pass


# Get a description
@db_task()
def get_description(bookmark_id):
    try:
        bookmark = Bookmark.objects.get(id=bookmark_id)
    except Bookmark.DoesNotExist:
        return
    try:
        response = requests.get(bookmark.url, timeout=2)
        soup = BeautifulSoup(response.text, features="lxml")
        metas = soup.find_all("meta", limit=10)
        description = next(
            (
                meta.attrs["content"]
                for meta in metas
                if "name" in meta.attrs
                and "content" in meta.attrs
                and meta.attrs["name"].lower() == "description"
            ),
            "",  # Default to an empty string if no description is found
        )
        bookmark.description = description
        bookmark.save()
    except requests.exceptions.RequestException:
        pass
