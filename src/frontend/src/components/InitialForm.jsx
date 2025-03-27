import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function InitialForm() {
  const [activeForm, setActiveForm] = useState("login");

  const handleLoginClick = () => {
    setActiveForm("login");
  };

  const handleRegisterClick = () => {
    setActiveForm("register");
  };
  return (
    <div>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleRegisterClick}>Register</button>
      {activeForm === "login" && <Login />}
      {activeForm === "register" && <Register />}
    </div>
  );
}
