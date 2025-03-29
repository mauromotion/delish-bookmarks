import CollectionsList from "./CollectionsList";
import classes from "./Sidebar.module.css";

const SideBar = () => {
  return (
    <div className={classes.sidebar}>
      {/* <h1>Sidebar</h1> */}
      <CollectionsList />
    </div>
  );
};

export default SideBar;
