"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleEmailInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setEmail(value);

    setErrors({
      ...errors,
      email:
        value.trim() === ""
          ? ""
          : validateEmail(value)
          ? ""
          : "Invalid email format",
    });
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setPassword(value);

    setErrors({
      ...errors,
      password:
        value.trim() === ""
          ? ""
          : validatePassword(value)
          ? ""
          : "Password must be at least 6 characters",
    });
  };

  const handleSubmitLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log("res :>> ", res);

    if (!email || !password) {
      console.log("email and/or password missing");
    }

    if (res?.error) {
      console.log("Login failed");
      toast.error("Login failed. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (!res?.error) {
      console.log("Login successfull");
      toast.success("Login successfull!", {
        position: "top-right",
        autoClose: 3000,
      });
      // redirect user to home page
      return;
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <form className={styles.registerForm}>
          <h1>Login</h1>
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

          <div className={styles.buttonContainer}>
            {!errors.email && !errors.password ? (
              <Button
                className={styles.loginButton}
                onClick={handleSubmitLogin}
              >
                Login
              </Button>
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
