import { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";

const DataContext = createContext({
  bookmarks: [],
  collections: [],
  tags: [],
  fetchBookmarks: () => {},
  fetchCollections: () => {},
  fetchTags: () => {},
});

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    bookmarks: [],
    collections: [],
    tags: [],
  });

  const { authFetch, accessToken } = useAuth();

  // Fetch and filter bookmarks
  const fetchBookmarks = useCallback(
    async (name, value) => {
      const queryParams = new URLSearchParams();

      // // Tags can be multiple so we need to iterate
      // if (name === "tag") {
      //   value.forEach((tag) => queryParams.append("tag", tag));

      //   // Otherwise we just append the single value
      // } else {
      //   queryParams.append(name, value);
      // }

      queryParams.append(name, value);

      const response = await authFetch(
        `http://localhost:8000/api/bookmarks?${queryParams.toString()}`,
        {
          headers: {
            "Content-type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Fetching bookmarks failed: ",
          errorData.detail || response.statusText,
        );
      }

      const data = await response.json();

      // Sort the bookmarks by creation, latest first
      const orderedBookmarks = data.results.sort((a, b) => {
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        return 0;
      });

      setData((prevState) => ({ ...prevState, bookmarks: orderedBookmarks }));
    },
    [authFetch],
  );

  // Fetch the user's collections
  const fetchCollections = useCallback(async () => {
    const response = await authFetch("http://localhost:8000/api/collections", {
      headers: {
        "Content-type": "application/json",
      },
    });

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
    setData((prevState) => ({
      ...prevState,
      collections: sortedCollections,
    }));
  }, [authFetch]);

  // Fetch user's tags
  const fetchTags = useCallback(async () => {
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
    setData((prevState) => ({ ...prevState, tags: sortedTags }));
  }, [authFetch]);

  // Fetch user's data at mount
  useEffect(() => {
    {
      if (accessToken) {
        fetchBookmarks("q", "all");
        fetchCollections();
        fetchTags();
      }
    }
  }, []);

  const ctxValue = {
    bookmarks: data.bookmarks,
    collections: data.collections,
    tags: data.tags,
    fetchBookmarks,
    fetchCollections,
    fetchTags,
  };

  return (
    <DataContext.Provider value={ctxValue}>{children}</DataContext.Provider>
  );
};

export default DataContext;
