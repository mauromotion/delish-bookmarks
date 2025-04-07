import classes from "./BookmarksList.module.css";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

import BookmarkCard from "./BookmarkCard";

const BookmarksList = () => {
  const { authFetch } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [tab, setTab] = useState("bookmarks");

  async function fetchBookmarks(query) {
    const response = await authFetch(
      `http://localhost:8000/api/bookmarks${query}`,
      {
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        "Fetching bookmakrs failed: ",
        errorData.detail || response.statusText,
      );
    }

    const data = await response.json();
    setBookmarks(data.results);
  }

  const handleReadItLaterTabClick = () => {
    setTab("readItLater");
    fetchBookmarks("?is_unread=True");
  };

  const handleBookmarksTabClick = () => {
    setTab("bookmarks");
    fetchBookmarks("?q=all");
  };

  // TODO: Extrapolate the fetchBookmarks(query) function
  // TODO: add query parameters to fetch filtered by collection and tags
  // Fetch all bookmarks of the current user at component mount
  useEffect(() => {
    fetchBookmarks("?q=all");
  }, []);

  return (
    <div className={classes.bmList}>
      <div className={classes.tabs}>
        <h4
          className={`${classes.label} ${tab === "bookmarks" ? classes.isActive : classes.isNotActive}`}
          onClick={handleBookmarksTabClick}
        >
          Bookmarks
        </h4>
        <h4
          className={`${classes.label} ${tab === "readItLater" ? classes.isActive : classes.isNotActive}`}
          onClick={handleReadItLaterTabClick}
        >
          Read It Later
        </h4>
      </div>
      <div className={classes.list}>
        <ul>
          {bookmarks.map((bm) => (
            <li key={bm.id}>
              <BookmarkCard {...bm} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookmarksList;
