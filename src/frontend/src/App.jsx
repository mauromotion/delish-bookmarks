import InitialForm from "./components/InitialForm/InitialForm";
import Header from "./components/Header/Header";
import { useAuth } from "./hooks/useAuth";
import MainSectionContainer from "./components/MainSectionContainer/MainSectionContainer";
import { DataProvider } from "./store/data-context";
import { ModalControllerProvider } from "./store/modals-context";

function App() {
  const { loading, accessToken } = useAuth();

  // Check the state of the data and render "loading..."
  {
    if (loading) return <div>Loading...</div>;
  }

  return (
    <DataProvider>
      <ModalControllerProvider>
        <div className="container">
          <Header />
          {!accessToken ? <InitialForm /> : <MainSectionContainer />}
        </div>
      </ModalControllerProvider>
    </DataProvider>
  );
}

export default App;
