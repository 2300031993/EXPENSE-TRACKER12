import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./AuthForms.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/api/users/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const userData = response.data;
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");

      alert("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      alert(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="auth-card"
      >
        <h2 className="auth-title">Login to Expense Tracker</h2>

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

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="login-btn"
          >
            Login
          </motion.button>
        </form>

        <div className="auth-links">
          <p>
            <a href="/forgot" className="link-forgot">
              Forgot Password?
            </a>
          </p>
          <p className="register-text">
            Don’t have an account?{" "}
            <a href="/register" className="link-register">
              Register
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
