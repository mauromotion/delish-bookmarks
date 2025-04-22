import { useContext } from "react";
import DataContext from "../store/data-context";

export const useDataCtx = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useDataCtx must be used within the DataContext Provider");
  }
  return ctx;
};
