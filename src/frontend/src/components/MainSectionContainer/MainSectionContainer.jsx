// import { useState } from "react";
// import { useAuth } from "../hooks/useAuth";
import BookmarksList from "../BookmarksList/BookmarksList";
import SideBar from "../SideBar/SideBar";
import classes from "./MainSectionContainer.module.css";

const MainSectionContainer = () => {
  // const { authFetch } = useAuth();
  // const [bookmarks, setBookmarks] = useState([]);

  // // Fetch and filter bookmarks
  // async function fetchBookmarks(name, value) {
  //   const queryParams = new URLSearchParams();

  //   // // Tags can be multiple so we need to iterate
  //   // if (name === "tag") {
  //   //   value.forEach((tag) => queryParams.append("tag", tag));

  //   //   // Otherwise we just append the single value
  //   // } else {
  //   //   queryParams.append(name, value);
  //   // }

  //   queryParams.append(name, value);

  //   const response = await authFetch(
  //     `http://localhost:8000/api/bookmarks?${queryParams.toString()}`,
  //     {
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     },
  //   );

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     throw new Error(
  //       "Fetching bookmarks failed: ",
  //       errorData.detail || response.statusText,
  //     );
  //   }

  //   const data = await response.json();

  //   // Sort the bookmarks by creation, latest first
  //   const orderedBookmarks = data.results.sort((a, b) => {
  //     if (a.timestamp < b.timestamp) {
  //       return 1;
  //     }
  //     if (a.timestamp > b.timestamp) {
  //       return -1;
  //     }
  //     return 0;
  //   });

  //   setBookmarks(orderedBookmarks);
  // }

  return (
    <div className={classes.bodyContainer}>
      <BookmarksList />
      <SideBar />
    </div>
  );
};

export default MainSectionContainer;
