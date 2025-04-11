"use client"; // Mark as a Client Component

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters

  // Extract the redirect query parameter
  const redirectPath = searchParams.get("redirect") || "/account"; // Default to "/" if no redirect is provided

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevent automatic redirection
      });

      if (res.error) {
        setError("Invalid email or password");
      } else {
        // Redirect to the intended page or default to "/"
        window.location.href = redirectPath;
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <main>
        <div>
          <h1>Login</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <a href="/auth/register">Register</a>
        </div>
      </main>
    </>
  );
}