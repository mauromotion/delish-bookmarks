import classes from "./CollectionsList.module.css";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

const Collections = () => {
  const { authFetch } = useAuth();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchCollections() {
      const response = await authFetch(
        "http://localhost:8000/api/collections",
        {
          headers: {
            "Content-type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Fetching collections failed: ",
          errorData.detail || response.statusText,
        );
      }

      const data = await response.json();

      // Sort the collections alphabetically, keeping "Unsorted" on top
      const sortedCollections = data.results.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        return nameA === "UNSORTED"
          ? -1
          : nameB === "UNSORTED"
            ? 1
            : nameA < nameB
              ? -1
              : nameA > nameB
                ? 1
                : 0;
      });
      setCollections(sortedCollections);
    }

    fetchCollections();
  }, []);

  // TODO: make a list of 'a' elements that send a query parameter to BookmarksList.jsx when clicked
  return (
    <div className={classes.list}>
      <ul>
        {collections.map((coll) => (
          <li key={coll.id}>{coll.name} (0)</li>
        ))}
      </ul>
    </div>
  );
};

export default Collections;
