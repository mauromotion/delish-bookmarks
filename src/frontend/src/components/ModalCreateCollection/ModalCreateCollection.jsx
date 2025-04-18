import { forwardRef } from "react";
import Modal from "../Modal/Modal";

const ModalCreateCollection = forwardRef((props, ref) => {
  return (
    <Modal
      ref={ref}
      title="Create a new collection"
      onClose={() => {}} //setBookmarkData(DEFAULT_bookmarkData)}
    ></Modal>
  );
});

export default ModalCreateCollection;
