import InitialForm from "./components/InitialForm/InitialForm";
import ModalAddBookmark from "./components/ModalAddBookmark/ModalAddBookmark";
import Header from "./components/Header/Header";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useRef } from "react";
import MainSectionContainer from "./components/MainSectionContainer/MainSectionContainer";
import { DataProvider } from "./store/data-context";

function App() {
  const { accessToken, refresh } = useAuth();
  const dialogRef = useRef(null);

  const openModal = () => {
    dialogRef.current.showModal();
  };

  // Refresh the access token if the page reloads
  useEffect(() => {
    if (!accessToken) {
      refresh();
    }
  }, []);

  // Set a timer to refresh the access token at 4'50"
  useEffect(() => {
    const timer = setTimeout(
      () => {
        refresh();
        console.log("access token refreshed!");
      },
      (4 * 60 + 50) * 1000,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [accessToken, refresh]);

  return (
    <DataProvider>
      <div className="container">
        <ModalAddBookmark ref={dialogRef} />
        <Header openModal={openModal} />
        {!accessToken ? <InitialForm /> : <MainSectionContainer />}
      </div>
    </DataProvider>
  );
}

export default App;
