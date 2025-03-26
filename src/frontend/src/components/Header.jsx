import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { logout, accessToken } = useAuth();

  return <ul>{accessToken && <button onClick={logout}>Logout</button>}</ul>;
}
