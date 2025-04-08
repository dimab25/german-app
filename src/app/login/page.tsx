"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import "@/styles/global.css";
import styles from "../register/page.module.css";
// import "react-toastify/dist/ReactToastify.css";
// import "../styles/LoginRegister.css";

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateUsername = (username: string) => {
    return username.length >= 4;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regular expression used to validate emails
    return emailRegex.test(email); // test method checks if the email string matches the pattern
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleUsernameInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUsername(e.target.value);
    setErrors({
      ...errors,
      username: validateUsername(e.target.value)
        ? ""
        : "Username must be at least 4 characters",
    });
  };

  const handleEmailInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
    setErrors({
      ...errors,

      email: validateEmail(e.target.value) ? "" : "Invalid email format",
    });
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
    setErrors({
      ...errors,

      password: validatePassword(e.target.value)
        ? ""
        : "Password must be at least 6 characters",
    });
  };

  //   const handleSubmitRegister = (
  //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     e.preventDefault();
  //     if (!validateEmail(email) || !validatePassword(password)) {
  //       setErrors({
  //         username: validateUsername(username)
  //           ? ""
  //           : "Username must be at least 4 characters",
  //         email: validateEmail(email) ? "" : "Invalid email format",
  //         password: validatePassword(password)
  //           ? ""
  //           : "Password must be at least 6 characters",
  //       });
  //       return;
  //     }
  //   };

  return (
    <>
      <h1>Login</h1>

      <div className={styles.formContainer}>
        <form className={styles.registerForm}>
          <Form.Group controlId="email">
            <Form.Control
              type="text"
              placeholder="Enter email"
              name="email"
              onChange={handleEmailInputChange}
              className={`${
                errors.email && errors.email.length > 0 ? styles.errorInput : ""
              }`}
            />
            {errors.email && errors.email.length > 0 ? (
              <p className={styles.error}>{errors.email}</p>
            ) : (
              ""
            )}
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Control
              type={"password"}
              placeholder="Enter password"
              name="password"
              onChange={handlePasswordInputChange}
              className={`${
                errors.password && errors.password.length > 0
                  ? styles.errorInput
                  : ""
              }`}
            />
            {errors.password && errors.password.length > 0 ? (
              <p className={styles.error}>{errors.password}</p>
            ) : (
              ""
            )}
          </Form.Group>

          <div className={styles.loginButton}>
            {!errors.email && !errors.username && !errors.password ? (
              <Button>Login</Button>
            ) : (
              <Button disabled>Login</Button>
            )}
          </div>
          <div>Don't have an account yet? Sign up!</div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
