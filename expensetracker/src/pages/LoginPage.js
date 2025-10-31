import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No user found. Please register first!");
      navigate("/register");
      return;
    }

    if (
      storedUser.email === email.trim().toLowerCase() &&
      storedUser.password === password
    ) {
      alert("Login successful!");
      // ✅ Store login session
      localStorage.setItem("isLoggedIn", true);
      // ✅ Redirect to Dashboard immediately
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Login
          </button>
        </form>

        <div className="auth-links">
          <p>
            <a href="/forgot" className="link-light">
              Forgot Password?
            </a>
          </p>
          <p style={{ color: "#e0e0e0" }}>
            Don't have an account?{" "}
            <a href="/register" className="link-light" style={{ fontWeight: "bold" }}>
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
