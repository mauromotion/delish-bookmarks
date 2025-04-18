import { createContext, useRef } from "react";
import ModalAddBookmark from "../components/ModalAddBookmark/ModalAddBookmark";
import ModalCreateCollection from "../components/ModalCreateCollection/ModalCreateCollection";

const ModalControllerContext = createContext(null);

export const ModalControllerProvider = ({ children }) => {
  const addBookmarkRef = useRef(null);
  const createCollectionRef = useRef(null);

  const openAddBookmark = () => addBookmarkRef.current?.showModal();
  const openCreateCollection = () => createCollectionRef.current?.showModal();

  return (
    <ModalControllerContext.Provider
      value={{ openAddBookmark, openCreateCollection }}
    >
      {children}
      <ModalAddBookmark ref={addBookmarkRef} />
      <ModalCreateCollection ref={createCollectionRef} />
    </ModalControllerContext.Provider>
  );
};

export default ModalControllerContext;
