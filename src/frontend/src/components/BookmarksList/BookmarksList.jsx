import classes from "./BookmarksList.module.css";
import { useState, useEffect, useContext } from "react";
import DataContext from "../../store/data-context";
import BookmarkCard from "../BookmarkCard/BookmarkCard";

const BookmarksList = () => {
  const [tab, setTab] = useState("bookmarks");
  const { bookmarks, fetchBookmarks } = useContext(DataContext);

  // Handlers
  const handleReadItLaterTabClick = () => {
    setTab("readItLater");
    fetchBookmarks("is_unread", "True");
  };

  const handleBookmarksTabClick = () => {
    setTab("bookmarks");
    fetchBookmarks("q", "all");
  };

  // Fetch all bookmarks of the current user at component mount
  useEffect(() => {
    fetchBookmarks("q", "all");
  }, [fetchBookmarks]);

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
