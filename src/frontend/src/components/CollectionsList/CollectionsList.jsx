import classes from "./CollectionsList.module.css";
import { useContext } from "react";
import DataContext from "../../store/data-context";
import { useModalController } from "../../hooks/useModalController";

const Collections = () => {
  const { fetchBookmarks, collections } = useContext(DataContext);
  const { openCreateCollection } = useModalController();

  const handleClickCollection = (value) => {
    fetchBookmarks("collection", value);
  };

  return (
    <div className={classes.list}>
      <ul>
        <button onClick={openCreateCollection}>Create New Collection</button>
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
