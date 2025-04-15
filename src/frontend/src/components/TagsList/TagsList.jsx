import classes from "./TagsList.module.css";
import { useContext } from "react";
import DataContext from "../../store/data-context";

const TagsList = () => {
  const { fetchBookmarks, tags } = useContext(DataContext);
  const handleClickTag = (value) => {
    fetchBookmarks("tag", value);
  };

  return (
    <div className={classes.list}>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>
            <p
              className={classes.tagLink}
              onClick={() => handleClickTag(tag.name)}
            >
              #{tag.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsList;
