import classes from "./ModalAddBookmark.module.css";
import Modal from "../Modal/Modal.jsx";
import { useState, useEffect, useContext, forwardRef } from "react";
import DataContext from "../../store/data-context.jsx";
import { useAuth } from "../../hooks/useAuth";

const ModalAddBookmark = forwardRef((props, ref) => {
  const { authFetch, userData, loading } = useAuth();
  const { collections } = useContext(DataContext);

  const DEFAULT_bookmarkData = {
    owner: userData.id,
    url: "",
    collection: "Unsorted",
    note: "",
    tags: [],
    is_unread: false,
    is_archived: false,
  };

  const [bookmarkData, setBookmarkData] = useState(DEFAULT_bookmarkData);

  // Load the userData when the Modal is rendered
  useEffect(() => {
    if (!loading && userData?.id) {
      setBookmarkData((prev) => ({
        ...prev,
        owner: userData.id,
      }));
    }
  }, [loading, userData]);

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
      ref.current.close(); // Close the modal on success
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
  };

  const handleCancel = () => {
    setBookmarkData(DEFAULT_bookmarkData);
    ref.current.close(); // Close the modal on cancel
  };

  // Check the state of the data and render "loading..."
  if (loading) return <div>Loading...</div>;

  // Render the Modal
  return (
    <Modal
      ref={ref}
      title="Add a new bookmark"
      onClose={() => setBookmarkData(DEFAULT_bookmarkData)}
    >
      <form className={classes.form} onSubmit={handleSubmit}>
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
        <div className={classes.buttons}>
          <button className={classes.saveButton} formMethod="submit">
            Save
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
});

export default ModalAddBookmark;
