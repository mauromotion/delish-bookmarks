import classes from "./CollectionsList.module.css";
import { useContext } from "react";
import DataContext from "../../store/data-context";

const Collections = () => {
  const { fetchBookmarks, collections } = useContext(DataContext);

  const handleClickCollection = (value) => {
    fetchBookmarks("collection", value);
  };

  const handleClickCreateCollection = () => {};

  return (
    <div className={classes.list}>
      <ul>
        <button onClick={handleClickCreateCollection}>
          Create New Collection
        </button>
        {collections.map((coll) => (
          <li key={coll.id}>
            <p
              className={classes.collectionLink}
              onClick={() => handleClickCollection(coll.name)}
            >
              {coll.name} (0)
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Collections;
