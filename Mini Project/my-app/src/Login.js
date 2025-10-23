import React, { useState } from "react";
import "./App.css"; // Import the CSS file
import jumpingJack from "./assets/jumpingjack.gif";

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
    <div className="login-page-container">
      <div className="login-image-container">
        <img src={jumpingJack} alt="Workout character" className="workout-gif" />
      </div>
      <div className="login-container">
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isSignUp ? "Register" : "Sign In"}</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p
          className="toggle-sign"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage("");
          }}
        >
          {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
        </p>
        <p className="motivational-quote">
          "The only bad workout is the one that didn't happen."
        </p>
      </div>
    </div>
  );
}

export default Login;
