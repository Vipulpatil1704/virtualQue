import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation between pages

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success (e.g., save the JWT token in local storage, etc.)
        setSuccess(data.msg);
        console.log("Token:", data.token);
      } else {
        // Handle error
        setError(data.msg);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred during login.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Navigate to the register page
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Don't have an account?</p>
        <button onClick={handleRegisterRedirect}>Register</button>
      </div>
    </div>
  );
};

export default Login;
