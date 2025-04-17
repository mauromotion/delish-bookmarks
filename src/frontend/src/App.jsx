import InitialForm from "./components/InitialForm/InitialForm";
import ModalAddBookmark from "./components/ModalAddBookmark/ModalAddBookmark";
import Header from "./components/Header/Header";
import { useAuth } from "./hooks/useAuth";
import { useRef } from "react";
import MainSectionContainer from "./components/MainSectionContainer/MainSectionContainer";
import { DataProvider } from "./store/data-context";

function App() {
  const { loading, accessToken } = useAuth();
  const addBookmarkModalRef = useRef(null);

  const openAddBookmarkModal = () => {
    addBookmarkModalRef.current.showModal();
  };

  // Check the state of the data and render "loading..."
  {
    if (loading) return <div>Loading...</div>;
  }

  return (
    <DataProvider>
      <div className="container">
        <ModalAddBookmark ref={addBookmarkModalRef} />
        <Header openModal={openAddBookmarkModal} />
        {!accessToken ? <InitialForm /> : <MainSectionContainer />}
      </div>
    </DataProvider>
  );
}

export default App;
