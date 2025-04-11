import classes from "./ModalAddBookmark.module.css";
import { createPortal } from "react-dom";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "../hooks/useAuth";

const ModalAddBookmark = forwardRef(({ children }, ref) => {
  const dialogRef = useRef();
  const { authFetch, userData } = useAuth();
  const [url, setUrl] = useState("");

  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current.showModal(),
    close: () => dialogRef.current.close(),
  }));

  async function addBookmark(url) {
    try {
      const response = await authFetch("http://localhost:8000/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          owner: userData.id,
          collection: "Programming",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Posting bookmark failed: ",
          errorData.detail || response.statusText,
        );
      }

      const data = await response.json();
      console.log("Bookmark saved successfully!", data);
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(url);
    addBookmark(url);
    e.target.reset();
    dialogRef.current.close();
  };

  return createPortal(
    <dialog ref={dialogRef}>
      {children}
      <form className={classes.form} onSubmit={handleSubmit}>
        <h2>Add a new bookmark</h2>
        <div>
          <label htmlFor="url">URL</label>
          <input
            type="text"
            name="url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
          <input type="text" name="tags" />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input type="text" name="description" />
        </div>
        <div>
          <button formMethod="submit">Save</button>
          <button formMethod="dialog">Cancel</button>
        </div>
      </form>
    </dialog>,
    document.getElementById("modal"),
  );
});

export default ModalAddBookmark;
