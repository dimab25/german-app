"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
// import { useRouter } from "next/router";

export default function SignInPage() {
  // const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log('res :>> ', res);

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
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>

          {error && <p>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </>
  );
}
