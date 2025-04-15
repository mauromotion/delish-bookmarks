import classes from "./ModalAddBookmark.module.css";
import { createPortal } from "react-dom";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import DataContext from "../../store/data-context.jsx";
import { useAuth } from "../../hooks/useAuth";

const ModalAddBookmark = forwardRef(({ children }, ref) => {
  const dialogRef = useRef();
  const { authFetch, userData, loading } = useAuth();
  const { collections } = useContext(DataContext);

  const [bookmarkData, setBookmarkData] = useState({
    owner: userData?.id || null,
    url: "",
    collection: "",
    tags: [],
    note: "",
  });

  // Load the userData when the Modal is rendered
  useEffect(() => {
    if (!loading && userData?.id) {
      setBookmarkData((prev) => ({
        ...prev,
        owner: userData.id,
      }));
    }
  }, [loading, userData]);

  // Expose dialog's methods directly
  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current.showModal(),
    close: () => dialogRef.current.close(),
  }));

  // POST request function to add a bookmark
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

  // Handling events functions
  const handleSubmit = (e) => {
    e.preventDefault();
    addBookmark(bookmarkData);
    e.target.reset();
    dialogRef.current.close();
  };

  const handleCancel = () => {
    setBookmarkData({
      owner: userData.id,
      url: "",
      collection: "",
      tags: [],
      note: "",
    });
    dialogRef.current.close();
  };

  // Check the state of the data and render "loading..."
  {
    if (loading) return <div>Loading...</div>;
  }

  // Check user authentication
  if (!userData?.id) {
    return <div>Error: User not authenticated.</div>;
  }

  // Render the Modal
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
              value={bookmarkData.url}
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
            <select
              type="text"
              name="collection"
              defaultValue={bookmarkData.collection}
              onChange={(e) =>
                setBookmarkData((prevState) => ({
                  ...prevState,
                  collection: e.target.value,
                }))
              }
            >
              <option value="">--select a collection--</option>
              {collections.map((coll) => (
                <option key={coll.id} value={coll.name}>
                  {coll.name}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="tags">Tags</label>
            <input type="text" name="tags" defaultValue={bookmarkData.tags} />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="note">Note</label>
            <textarea
              name="note"
              value={bookmarkData.note}
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
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>,
    document.getElementById("modal"),
  );
});

export default ModalAddBookmark;
