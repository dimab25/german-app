"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import "@/styles/global.css";
import styles from "../register/page.module.css";
import Link from "next/link";
import { validateEmail, validatePassword } from "@/utils/inputValidators";
import { signIn } from "next-auth/react";

// import "react-toastify/dist/ReactToastify.css";
// import "../styles/LoginRegister.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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
        : "Password must be at least 5 characters",
    });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log("res :>> ", res);

    if (res?.ok) {
      console.log("logged in");
      // router.push("/testpage");
      // redirect after login
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <h1>Login</h1>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmitLogin} className={styles.registerForm}>
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
            {!errors.email && !errors.password ? (
              <Button onClick={handleSubmitLogin}>Login</Button>
            ) : (
              <Button disabled>Login</Button>
            )}
          </div>
          <div>
            Don't have an account yet?{" "}
            <Link className={styles.linkText} href="/register">
              Create one here!
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
