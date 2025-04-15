import classes from "./ModalAddBookmark.module.css";
import { createPortal } from "react-dom";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "../../hooks/useAuth";

const ModalAddBookmark = forwardRef(({ children }, ref) => {
  const dialogRef = useRef();
  const { authFetch, userData } = useAuth();

  const [bookmarkData, setBookmarkData] = useState({
    owner: userData.id,
    url: "",
    collection: "Programming",
    tags: [],
    note: "",
  });

  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current.showModal(),
    close: () => dialogRef.current.close(),
  }));

  async function addBookmark(bookmarkData) {
    try {
      const response = await authFetch("http://localhost:8000/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(bookmarkData),
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
    addBookmark(bookmarkData);
    e.target.reset();
    dialogRef.current.close();
  };

  return createPortal(
    <dialog ref={dialogRef}>
      {children}
      <form className={classes.form} onSubmit={handleSubmit}>
        <h2>Add a new bookmark:</h2>
        <div className={classes.inputs}>
          <div className={classes.formGroup}>
            <label htmlFor="url">URL</label>
            <input
              type="text"
              name="url"
              onChange={(e) =>
                setBookmarkData((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="collection">Collection</label>
            <input type="text" name="collection" />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="tags">Tags</label>
            <input type="text" name="tags" />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="note">Note</label>
            <textarea
              name="note"
              rows="5"
              cols="33"
              onChange={(e) =>
                setBookmarkData((prevState) => ({
                  ...prevState,
                  note: e.target.value,
                }))
              }
            />
          </div>
        </div>
        {/* <div> */}
        {/*   <label htmlFor="title">Title</label> */}
        {/*   <input type="text" name="title" /> */}
        {/* </div> */}
        {/* <div> */}
        {/*   <label htmlFor="description">Description</label> */}
        {/*   <input type="text" name="description" /> */}
        {/* </div> */}
        <div className={classes.buttons}>
          <button className={classes.saveButton} formMethod="submit">
            Save
          </button>
          <button formMethod="dialog">Cancel</button>
        </div>
      </form>
    </dialog>,
    document.getElementById("modal"),
  );
});

export default ModalAddBookmark;
