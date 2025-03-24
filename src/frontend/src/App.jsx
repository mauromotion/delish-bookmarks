import "./App.css";
import Login from "./components/Login";
import HomePage from "./components/HomePage";

function App() {
  const isAuthenticated = false;

  return <>{!isAuthenticated ? <Login /> : <HomePage />}</>;
}

export default App;
