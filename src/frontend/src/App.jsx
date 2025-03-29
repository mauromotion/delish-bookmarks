import InitialForm from "./components/InitialForm";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import SideBar from "./components/SideBar";

function App() {
  const { accessToken, refresh } = useAuth();

  // Refresh the access token if the page reloads
  useEffect(() => {
    if (!accessToken) {
      refresh();
    }
  }, []);

  return (
    <div className="container">
      <Header />
      {!accessToken ? (
        <InitialForm />
      ) : (
        <div className="body-container">
          <HomePage />
          <SideBar />
        </div>
      )}
    </div>
  );
}

export default App;
