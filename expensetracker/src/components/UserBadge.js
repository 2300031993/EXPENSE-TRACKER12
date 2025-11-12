import React, { useEffect, useState } from "react";
import "./UserBadge.css";

const UserBadge = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    } else if (user && user.email) {
      // fallback: show prefix of email if no name present
      setUserName(user.email.split("@")[0]);
    }
  }, []);

  return (
    <div className="user-badge">
      <div className="user-avatar">
        {userName?.charAt(0)?.toUpperCase()}
      </div>
      <span className="user-name">{userName}</span>
    </div>
  );
};

export default UserBadge;
