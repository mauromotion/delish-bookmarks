import classes from "./HomePage.module.css";
import BookmarksList from "./BookmarksList";

const HomePage = () => {
  return (
    <div className={classes.homePage}>
      <BookmarksList />
    </div>
  );
};

export default HomePage;
