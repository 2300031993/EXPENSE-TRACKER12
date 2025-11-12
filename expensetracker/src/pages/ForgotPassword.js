import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./AuthForms.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert("🔗 Password reset link sent to your email (demo message).");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="auth-card"
      >
        <h2 className="auth-title">Forgot Password</h2>
        <p className="text-muted" style={{ marginBottom: "1.2rem", color: "#aaa" }}>
          Enter your registered email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="login-btn"
            style={{
              background: "linear-gradient(135deg, #079cffff, #00bbffff)",
              boxShadow: "0 0 10px #2cf1ffff",
            }}
          >
            Send Reset Link
          </motion.button>
        </form>

        <div className="auth-links mt-3">
          <p className="register-text">
            Remember your password?{" "}
            <a href="/login" className="link-register">
              Back to Login
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
