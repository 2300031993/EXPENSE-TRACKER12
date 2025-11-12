// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaHistory, FaPlus, FaSave, FaChartBar, FaCog, FaSignOutAlt, FaDownload } from "react-icons/fa";
import "./Sidebar.css";


export default function Sidebar() {
  const loc = useLocation().pathname;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navItem = (to, label, icon) => (
    <li className={`sidebar-item ${loc === to ? "active" : ""}`}>
      <Link to={to} className="sidebar-link">
        <span className="me-2">{icon}</span>
        {label}
      </Link>
    </li>
  );

  return (
    <aside className="app-sidebar">
      <div className="brand">
        <div className="brand-icon">💼</div>
        <div className="brand-title">MyWallet</div>
      </div>

      <ul className="sidebar-nav">
        {navItem("/dashboard", "Dashboard", <FaTachometerAlt />)}
        {navItem("/transactions", "Transactions History", <FaHistory />)}
        {navItem("/new-transaction", "New Transaction", <FaPlus />)}
        {navItem("/saved", "Saved Transactions", <FaSave />)}
        {navItem("/statistics", "Statistics", <FaChartBar />)}
        {navItem("/budget-tracker", "Budget Tracker", <FaChartBar />)}
        {navItem("/reports", "Reports", <FaDownload />)}
        {navItem("/settings", "Settings", <FaCog />)}
      </ul>

      <div className="sidebar-bottom">
        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Log out
        </button>
      </div>
    </aside>
  );
}
