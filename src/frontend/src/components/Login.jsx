import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import classes from "./Forms.module.css";

const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const { login } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();

    const credentials = { username: username, password: password };
    login(credentials);
  }

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
