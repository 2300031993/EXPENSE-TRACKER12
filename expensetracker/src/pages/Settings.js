import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Settings.css";

export default function Settings() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    notifications: true,
  });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const userEmail =
    localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

  // Fetch user data on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/users/${userEmail}`
        );
        setUser({
          username: res.data.username,
          email: res.data.email,
          notifications: res.data.notifications ?? true,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userEmail) fetchUser();
  }, [userEmail]);

  // Save settings
  const handleSave = async () => {
    try {
      await axios.put("http://localhost:8080/api/users/update", user);
      alert("✅ Settings updated successfully!");
    } catch {
      alert("⚠️ Error saving changes.");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle("dark-mode", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Logout user
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Change password
  const handlePasswordChange = async () => {
    if (passwords.newPass !== passwords.confirmPass) {
      alert("⚠️ Passwords do not match!");
      return;
    }
    try {
      await axios.put("http://localhost:8080/api/users/update-password", {
        email: user.email,
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      alert("✅ Password updated!");
      setShowPasswordModal(false);
      setPasswords({ current: "", newPass: "", confirmPass: "" });
    } catch {
      alert("⚠️ Password update failed.");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete your account permanently?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${user.email}`);
      alert("Account deleted!");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/register";
    } catch {
      alert("⚠️ Error deleting account.");
    }
  };

  if (loading) return <p className="loading">Loading settings...</p>;

  return (
    <div className="settings-page">
      <h2 className="settings-title">⚙️ Account Settings</h2>

      {/* Profile Section */}
      <div className="settings-card" style={{ width: "420px" }}>
        <h3>👤 Profile</h3>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>
        <button className="btn-glow" onClick={handleSave}>
          💾 Save Changes
        </button>
      </div>

      {/* Preferences Section */}
      <div className="settings-card" style={{ width: "420px" }}>
        <h3>🎛️ Preferences</h3>
        <div className="toggle-row">
          <span>Enable Notifications</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={user.notifications}
              onChange={(e) =>
                setUser({ ...user, notifications: e.target.checked })
              }
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <span>Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Security Section */}
      <div className="settings-card security-card" style={{ width: "420px" }}>
        <h3>🔒 Security</h3>
        <p>Manage your password and account privacy.</p>
        <div className="security-actions">
          <button
            className="btn-small btn-blue"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
          <button
            className="btn-small btn-red"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
          <button className="btn-small btn-gray" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirmPass}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPass: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={handlePasswordChange}>Save</button>
              <button
                className="cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box delete">
            <h3>Confirm Account Deletion</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={handleDeleteAccount}>Yes, Delete</button>
              <button
                className="cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
