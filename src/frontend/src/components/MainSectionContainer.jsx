import BookmarksList from "../BookmarksList/BookmarksList";
import SideBar from "../SideBar";
import classes from "./MainSectionContainer.module.css";

const MainSectionContainer = () => {
  return (
    <div className={classes.bodyContainer}>
      <BookmarksList />
      <SideBar />
    </div>
  );
};

export default MainSectionContainer;
