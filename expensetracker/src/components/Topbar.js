// src/components/Topbar.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const Topbar = () => {
  const location = useLocation();

  const pageTitleMap = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions History",
    "/new-transaction": "New Transaction",
    "/statistics": "Statistics",
    "/settings": "Settings",
  };

  const title = pageTitleMap[location.pathname] || "";

  return (
    <div className="topbar d-flex justify-content-between align-items-center p-3">
      <h3 className="text-white">{title}</h3>
      <div className="user-info d-flex align-items-center gap-2">
        <div className="avatar bg-primary text-white rounded-circle p-2">A</div>
        <span className="text-white">abcd@gmail.com</span>
      </div>
    </div>
  );
};

export default Topbar;
