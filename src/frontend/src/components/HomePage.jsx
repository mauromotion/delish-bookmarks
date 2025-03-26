import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { userData } = useAuth();

  const username = userData.username;

  return <h1>Welcome, {username}</h1>;
}
