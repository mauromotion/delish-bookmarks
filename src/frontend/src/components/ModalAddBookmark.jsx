import classes from "./ModalAddBookmark.module.css";
import { createPortal } from "react-dom";
import { useRef, forwardRef, useImperativeHandle } from "react";

const ModalAddBookmark = forwardRef(({ children }, ref) => {
  const dialogRef = useRef();

  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current.showModal(),
    close: () => dialogRef.current.close(),
  }));

  return createPortal(
    <dialog ref={dialogRef}>
      {children}
      <form className={classes.form}>
        <h2>Add a new bookmark</h2>
        <div>
          <label htmlFor="url">URL</label>
          <input type="text" name="url" />
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
          <button formMethod="post">Save</button>
          <button formMethod="dialog">Cancel</button>
        </div>
      </form>
    </dialog>,
    document.getElementById("modal"),
  );
});

export default ModalAddBookmark;
