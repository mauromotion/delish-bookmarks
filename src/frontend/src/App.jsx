import InitialForm from "./components/InitialForm";
import BookmarksList from "./components/BookmarksList";
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
    <div className="container">
      <Header />
      {!accessToken ? (
        <InitialForm />
      ) : (
        <div className="body-container">
          <BookmarksList />
          <SideBar />
        </div>
      )}
    </div>
  );
}

export default App;
