import "./App.css";
import InitialForm from "./components/InitialForm";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

function App() {
  const { accessToken, username, refresh } = useAuth();

  // Refresh the access token if the page reloads
  useEffect(() => {
    if (!accessToken) {
      refresh();
    }
  }, []);

  return (
    <>
      <Header />
      {!accessToken ? <InitialForm /> : <HomePage username={username} />}
    </>
  );
}

export default App;
