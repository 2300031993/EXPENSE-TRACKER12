// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import NewTransaction from "./pages/NewTransaction";
import TransactionHistory from "./pages/TransactionHistory";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div
          className="main-content container-fluid"
          style={{
            padding: "15px 25px",
            marginTop: "-10px", //
            minHeight: "100vh",
            backgroundColor: "#0d141b", // blends nicely with dashboard
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TransactionHistory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-transaction"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NewTransaction />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Statistics />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
