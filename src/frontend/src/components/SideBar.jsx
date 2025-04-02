import CollectionsList from "./CollectionsList";
import TagsList from "./TagsList";
import classes from "./Sidebar.module.css";
import { useState } from "react";

const SideBar = () => {
  const [tab, setTab] = useState("collections");

  const handleCollectionsClick = () => {
    setTab("collections");
  };
  const handleTagsClick = () => {
    setTab("tags");
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.navSidebar}>
        <h4
          className={`classes.label ${
            tab === "collections" ? classes.isActive : classes.isNotActive
          }
          `}
          onClick={handleCollectionsClick}
        >
          Collections
        </h4>
        <h4
          className={`classes.label ${
            tab === "tags" ? classes.isActive : classes.isNotActive
          }
          `}
          onClick={handleTagsClick}
        >
          Tags
        </h4>
      </div>
      {tab === "collections" ? (
        <CollectionsList isActive={true} />
      ) : (
        <TagsList isActive={true} />
      )}
    </div>
  );
};

export default SideBar;
