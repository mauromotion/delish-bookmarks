import InitialForm from "./components/InitialForm/InitialForm";
import ModalAddBookmark from "./components/ModalAddBookmark/ModalAddBookmark";
import Header from "./components/Header/Header";
import { useAuth } from "./hooks/useAuth";
import { useRef } from "react";
import MainSectionContainer from "./components/MainSectionContainer/MainSectionContainer";
import { DataProvider } from "./store/data-context";

function App() {
  const { loading, userData } = useAuth();
  const dialogRef = useRef(null);

  const openModal = () => {
    dialogRef.current.showModal();
  };

  // Check the state of the data and render "loading..."
  {
    if (loading) return <div>Loading...</div>;
  }

  // Check user authentication
  if (!userData?.id) {
    return <div>Error: User not authenticated.</div>;
  }
  return (
    <DataProvider>
      <div className="container">
        <ModalAddBookmark ref={dialogRef} />
        <Header openModal={openModal} />
        {!userData ? <InitialForm /> : <MainSectionContainer />}
      </div>
    </DataProvider>
  );
}

export default App;
