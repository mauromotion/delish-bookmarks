import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import classes from "./Forms.module.css";

const Register = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);

  const { register } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();

    const credentials = {
      username: username,
      password: password,
      email: email,
    };
    register(credentials);
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
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
