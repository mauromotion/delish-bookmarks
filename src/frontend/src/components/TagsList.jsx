import classes from "./TagsList.module.css";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

const TagsList = () => {
  const { authFetch } = useAuth();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchTags() {
      const response = await authFetch("http://localhost:8000/tags", {
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Fetching tags failed: ",
          errorData.detail || response.statusText,
        );
      }

      const data = await response.json();

      // Sort the tags alphabetically
      const sortedTags = data.results.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      setTags(sortedTags);
    }

    fetchTags();
  }, []);

  return (
    <div className={classes.list}>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TagsList;
