import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { username } = useAuth();

  return <h1>Welcome, {username}</h1>;
}
