import classes from "./HomePage.module.css";
import BookmarksList from "./BookmarksList";

export default function HomePage() {
  return (
    <div className={classes.homePage}>
      <BookmarksList />
    </div>
  );
}
