import classes from "./BookmarksList.module.css";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

import BookmarkCard from "./BookmarkCard";

const BookmarksList = () => {
  const { authFetch } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  // Fetch all bookmarks of the current user

  // TODO: add query parameters to fetch filtered by collection and tags
  useEffect(() => {
    async function fetchBookmarks() {
      const response = await authFetch(
        "http://localhost:8000/api/bookmarks?q=all",
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

    fetchBookmarks();
  }, []);

  // TODO: add a "Read it Later" header that filters the bookmarks with a query
  return (
    <div className={classes.bmList}>
      <h4>Bookmarks</h4>
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
