import { createContext, useContext, useRef } from "react";
import ModalAddBookmark from "../components/ModalAddBookmark/ModalAddBookmark";
import ModalCreateCollection from "../components/ModalCreateCollection/ModalCreateCollection";

const ModalControllerContext = createContext(null);

// Custom hook to consume the context
export function useModalController() {
  const ctx = useContext(ModalControllerContext);
  if (!ctx)
    throw new Error("useModalController must be used within its Provider");
  return ctx;
}

// Provider component
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
