import { useContext } from "react";
import ModalControllerContext from "../store/modals-context.jsx";

export const useModalController = () => {
  const ctx = useContext(ModalControllerContext);
  if (!ctx) {
    throw new Error(
      "useModalController must be used within the ModalControllerProvider",
    );
  }
  return ctx;
};
