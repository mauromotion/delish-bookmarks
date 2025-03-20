import favicon
import requests
from bs4 import BeautifulSoup
from urltitle import URLTitleReader


# Get the title
def get_title(url):
    try:
        reader = URLTitleReader(verify_ssl=True)
        title = reader.title(url)
    except Exception:
        title = ""
    return title


# Get the favicon
def get_favicon(url):
    try:
        user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36"
        headers = {"User-Agent": user_agent}

        favicon_check = favicon.get(url, headers=headers, timeout=2)
        if favicon_check:
            url_favicon = favicon_check[0].url
    except requests.exceptions.RequestException:
        url_favicon = ""
    return url_favicon


# Get a description
def get_description(url):
    try:
        response = requests.get(url, timeout=2)
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
    except requests.exceptions.RequestException:
        description = ""
    return description
