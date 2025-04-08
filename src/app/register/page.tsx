"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import "@/styles/global.css";
import styles from "./page.module.css";
import Link from "next/link";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/utils/inputValidators";
// import "react-toastify/dist/ReactToastify.css";
// import "../styles/LoginRegister.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

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
      <h1>Register</h1>

      <div className={styles.formContainer}>
        <form className={styles.registerForm}>
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              onChange={handleUsernameInputChange}
              className={`${
                errors.username && errors.username.length > 0
                  ? styles.errorInput
                  : ""
              }`}
            />
            {errors.username && errors.username.length > 0 ? (
              <p className={styles.error}>{errors.username}</p>
            ) : (
              ""
            )}
          </Form.Group>

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
              <Button>Register</Button>
            ) : (
              <Button disabled>Register</Button>
            )}
          </div>

          <div>
            Already have an account?{" "}
            <Link className={styles.linkText} href="/login">
              Sign in!
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
