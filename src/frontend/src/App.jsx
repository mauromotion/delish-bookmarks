import "./App.css";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { accessToken, username } = useAuth();

  return <>{!accessToken ? <Login /> : <HomePage username={username} />}</>;
}

export default App;
