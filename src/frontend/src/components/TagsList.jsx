import classes from "./TagsList.module.css";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

const TagsList = ({ fetchBookmarks }) => {
  const { authFetch } = useAuth();
  const [tags, setTags] = useState([]);
  const handleClickTag = (value) => {
    fetchBookmarks("tag", value);
  };

  // Fetch all the user's tags at component's mount
  useEffect(() => {
    async function fetchTags() {
      const response = await authFetch("http://localhost:8000/api/tags", {
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
  });

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
