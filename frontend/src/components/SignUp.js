import React, { useState } from "react";
import axios from "axios";
// import "../App.css";
import "./signup.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role

  const handleSignUp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
        role, // Send the selected role
      });
      alert("Signup Successful!");
      window.location.href = "/login"; // Redirect to login page after signup
    } catch (error) {
      alert("Signup Failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Role selection dropdown */}
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="venueOwner">Venue Owner</option>
        <option value="organizer">Organizer</option>
      </select>

      <button onClick={handleSignUp}>Sign Up</button>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
