"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/global.css";
import styles from "./page.module.css";
import Link from "next/link";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/utils/inputValidators";
import { useRouter } from "next/navigation";

function Register() {
  const [username, setUsername] = useState("");
  const [userLanguage, setUserLanguage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleUsernameInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setUsername(value);

    // trim method checks if the input is empty, removes the error if true
    setErrors({
      ...errors,
      username:
        value.trim() === ""
          ? ""
          : validateUsername(value)
          ? ""
          : "Username must be at least 4 characters",
    });
  };

  const handleUserLanguageInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUserLanguage(e.target.value);
    // setErrors({
    //   ...errors,
    //   username: validateUsername(e.target.value)
    //     ? ""
    //     : "Username must be at least 4 characters",
    // });
  };

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

  const handleSubmitRegister = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!email || !password || !userLanguage || !username) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password,
      name: username,
      native_language: userLanguage,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      "http://localhost:3000/api/register",
      requestOptions
    );

    if (!response.ok) {
      console.log("Error while trying to register new user");
      toast.error("Registration failed, email already in use. Try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      toast.success(
        "Registration successful! You'll be redirected in 3 seconds.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <form className={styles.registerForm}>
          <h1>Register</h1>
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

          <Form.Group controlId="language">
            <Form.Select
              name="language"
              onChange={handleUserLanguageInputChange}
            >
              <option value="">Select language...</option>
              <optgroup>
                <option value="English">English</option>
                <option value="Turkish">Turkish</option>
                <option value="Italian">Italian</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Polish">Polish</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Russian">Russian</option>
                <option value="Japanese">Japanese</option>
              </optgroup>
            </Form.Select>
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

          <div className={styles.buttonContainer}>
            {!errors.email && !errors.username && !errors.password ? (
              <Button
                className={styles.loginButton}
                onClick={handleSubmitRegister}
              >
                Register
              </Button>
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
