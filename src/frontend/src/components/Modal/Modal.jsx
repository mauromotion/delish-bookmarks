import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
// import SaveButton from "../Buttons/SaveButton/SaveButton.jsx";
// import CancelButton from "../Buttons/CancelButton/CancelButton.jsx";
import classes from "./Modal.module.css";

const Modal = forwardRef(({ children, title, onClose }, ref) => {
  const dialogRef = useRef(null);

  // Expose the modal methods to parent components via ref
  useImperativeHandle(ref, () => ({
    showModal: () => {
      dialogRef.current?.showModal();
    },
    close: () => {
      dialogRef.current?.close();
    },
    get open() {
      return dialogRef.current?.open || false;
    },
  }));

  // const handleCancel = () => {
  //   dialogRef.current.close();
  // };

  return createPortal(
    <dialog
      ref={dialogRef}
      className={classes.dialog}
      onClick={(e) => {
        // Close when clicking outside the modal content
        if (e.target === dialogRef.current) {
          dialogRef.current.close();
          if (onClose) onClose();
        }
      }}
    >
      <div className={classes.modalContent}>
        {title && (
          <div className={classes.header}>
            <h2>{title}</h2>
          </div>
        )}
        <div>{children}</div>
        <div className={classes.buttons}>
          {/* <SaveButton /> */}
          {/* <CancelButton onclick={handleCancel()} /> */}
        </div>
      </div>
    </dialog>,
    document.getElementById("modal"),
  );
});

export default Modal;
