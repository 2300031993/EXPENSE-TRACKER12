import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert("Password reset link sent to your email (demo message).");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label">Enter Your Registered Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 mt-2">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
