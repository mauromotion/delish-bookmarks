import classes from "./InitialForm.module.css";
import { useState } from "react";
import Login from "../LoginRegisterForms/Login";
import Register from "../LoginRegisterForms/Register";

const InitialForm = () => {
  const [activeForm, setActiveForm] = useState("login");

  const handleLoginClick = () => {
    setActiveForm("login");
  };

  const handleRegisterClick = () => {
    setActiveForm("register");
  };
  return (
    <div className={classes.initialForm}>
      {activeForm === "login" && <Login />}
      {activeForm === "register" && <Register />}
      <div className={classes.formNavLinks}>
        <p onClick={handleLoginClick}>Login</p>
        <span>or</span>
        <p onClick={handleRegisterClick}>Register</p>
      </div>
    </div>
  );
};

export default InitialForm;
