// src/pages/TransactionHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
    date: "",
  });

  // ✅ Fetch transactions only for logged-in user
  const fetchTransactions = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        alert("⚠️ User not logged in. Please log in again.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/transactions?email=${userEmail}`
      );

      setTransactions(response.data);
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
      alert("Failed to fetch transactions. Please check backend connection.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ Delete a transaction by ID
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:8081/api/transactions/${id}`);
        alert("🗑 Transaction deleted successfully!");
        fetchTransactions(); // Refresh list
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("❌ Failed to delete transaction!");
      }
    }
  };

  // ✅ Open edit modal
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction.id);
    setEditData({
      title: transaction.title || "",
      amount: transaction.amount || "",
      category: transaction.category || "",
      type: transaction.type || "expense",
      date: transaction.date ? transaction.date.split("T")[0] : "",
    });
  };

  // ✅ Handle form input change
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // ✅ Save updated transaction
  const handleSave = async () => {
    try {
      if (
        !editData.title ||
        !editData.amount ||
        !editData.category ||
        !editData.date
      ) {
        alert("⚠️ Please fill all fields before saving!");
        return;
      }

      await axios.put(
        `http://localhost:8081/api/transactions/${editingTransaction}`,
        editData
      );

      alert("✅ Transaction updated successfully!");
      setEditingTransaction(null);
      fetchTransactions(); // Refresh after save
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("❌ Failed to update transaction!");
    }
  };

  // ✅ Cancel edit
  const handleCancel = () => {
    setEditingTransaction(null);
  };

  // ✅ Group transactions by date (Today, Yesterday, etc.)
  const groupByDate = (transactions) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date) =>
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    const grouped = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const dateStr = formatDate(date);

      let label = dateStr;
      if (date.toDateString() === today.toDateString()) label = "Today";
      else if (date.toDateString() === yesterday.toDateString())
        label = "Yesterday";

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(t);
    });

    return grouped;
  };

  const groupedTransactions = groupByDate(transactions);

  return (
    <div className="transaction-history">
      {/* 🔍 Filter & Search Bar */}
      <div className="filter-bar">
        <select>
          <option>All</option>
          <option>Food</option>
          <option>Shopping</option>
          <option>Travel</option>
        </select>
        <input type="text" placeholder="Search transactions" />
      </div>

      {/* 📅 Grouped Transactions */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <p className="no-transactions">No transactions found</p>
      ) : (
        Object.keys(groupedTransactions).map((dateKey) => (
          <div key={dateKey} className="date-section">
            <h3 className="date-header">{dateKey}</h3>
            {groupedTransactions[dateKey].map((t) => (
              <div key={t.id} className="transaction-card">
                <div className="transaction-info">
                  <strong>{t.category}</strong>
                  <p>{t.title || "No description"}</p>
                </div>
                <div className="transaction-right">
                  <div
                    className={`transaction-amount ${
                      t.type === "expense" ? "expense" : "income"
                    }`}
                  >
                    {t.type === "expense" ? "- " : "+ "}₹{t.amount}
                  </div>
                  <button className="edit-btn" onClick={() => handleEdit(t)}>
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(t.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* ✏️ Edit Modal */}
      {editingTransaction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Transaction</h2>

            <label>Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={editData.type === "expense"}
                  onChange={handleChange}
                />
                Expense
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={editData.type === "income"}
                  onChange={handleChange}
                />
                Income
              </label>
            </div>

            <label>Category</label>
            <select
              name="category"
              value={editData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Leisure">Leisure</option>
              <option value="Household">Household</option>
              <option value="Clothing">Clothing</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>

            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
            />

            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={editData.amount}
              onChange={handleChange}
            />

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={editData.date}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
