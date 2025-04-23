import { useState, forwardRef, useEffect } from "react";
import Modal from "../Modal/Modal";
import { useAuth } from "../../hooks/useAuth";
import classes from "./ModalCreateCollection.module.css";

const ModalCreateCollection = forwardRef((props, ref) => {
  const { authFetch, userData, loading } = useAuth();

  const [collectionData, setCollectionData] = useState({
    owner: userData.id,
    name: "",
    description: "",
  });

  // Load the userData when the Modal is rendered
  useEffect(() => {
    if (!loading && userData?.id) {
      setCollectionData((prev) => ({
        ...prev,
        owner: userData.id,
      }));
    }
  }, [loading, userData]);

  // POST request to create collection
  async function createNewCollection(collectionData) {
    try {
      const response = await authFetch(
        "http://localhost:8000/api/collections",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(collectionData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          "Posting new collection failed: ",
          errorData.detail || response.statusText,
        );
      }

      const data = await response.json();
      console.log("Collection saved successfully!", data);
      ref.current.close(); // Close the modal on success
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewCollection(collectionData);
    e.target.reset();
  };

  const handleCancel = () => {
    ref.current.close(); // Close the modal on cancel
  };

  return (
    <Modal
      ref={ref}
      title="Create a new collection"
      onClose={() => {}} //setBookmarkData(DEFAULT_bookmarkData)}
    >
      <form className="{classes.form}" onSubmit={handleSubmit}>
        <div className={classes.inputs}>
          <div className={classes.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={collectionData.name}
              onChange={(e) => {
                setCollectionData((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }));
              }}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              value={collectionData.description}
              onChange={(e) => {
                setCollectionData((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }));
              }}
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

export default ModalCreateCollection;
