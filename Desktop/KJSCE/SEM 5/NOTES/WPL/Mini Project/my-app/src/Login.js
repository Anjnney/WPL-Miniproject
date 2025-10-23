import React, { useState } from "react";

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Register new user
      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[username]) {
        setMessage("Username already exists!");
      } else {
        users[username] = password;
        localStorage.setItem("users", JSON.stringify(users));
        setMessage("Registered successfully! Please sign in.");
        setIsSignUp(false);
        setUsername("");
        setPassword("");
      }
    } else {
      // Sign in existing user
      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[username] && users[username] === password) {
        onLogin(username);
      } else {
        setMessage("Invalid username or password!");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "10px", margin: "5px", borderRadius: "5px" }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", margin: "5px", borderRadius: "5px" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          {isSignUp ? "Register" : "Sign In"}
        </button>
      </form>
      <p style={{ marginTop: "10px", color: "#ffe600" }}>{message}</p>
      <p
        style={{ cursor: "pointer", color: "#ff4d6d" }}
        onClick={() => {
          setIsSignUp(!isSignUp);
          setMessage("");
        }}
      >
        {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
      </p>
    </div>
  );
}

export default Login;
