import classes from "./BookmarksList.module.css";

const Bookmarks = () => {
  return (
    <div>
      <h4>Bookmarks</h4>
      <div className={classes.list}></div>
    </div>
  );
};

export default Bookmarks;
