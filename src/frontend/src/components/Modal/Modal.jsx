import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(
  ({ children, title, onClose, className = "" }, ref) => {
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

    return createPortal(
      <dialog
        ref={dialogRef}
        className={className}
        onClick={(e) => {
          // Close when clicking outside the modal content
          if (e.target === dialogRef.current) {
            dialogRef.current.close();
            if (onClose) onClose();
          }
        }}
      >
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button
              className="close-button"
              onClick={() => {
                dialogRef.current?.close();
                if (onClose) onClose();
              }}
            ></button>
          </div>
        )}
        <div className="modal-content">{children}</div>
      </dialog>,
      document.getElementById("modal"),
    );
  },
);

export default Modal;
