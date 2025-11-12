import React, { useState } from "react";
import "./NewTransaction.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewTransaction = () => {
  const [transaction, setTransaction] = useState({
    title: "",
    amount: "",
    category: "",
    type: "income",
    date: "",
  });

  const navigate = useNavigate();

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  // ✅ Submit form and add transaction
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch user email from localStorage (make sure it's saved at login)
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user?.email;

      if (!userEmail) {
        alert("⚠️ User not logged in. Please log in again.");
        navigate("/login");
        return;
      }

      const transactionData = {
        ...transaction,
        userEmail,
        amount: parseFloat(transaction.amount),
      };

      // ✅ Send POST request to backend
      await axios.post("http://localhost:8081/api/transactions", transactionData);

      // ✅ Notify all pages that a transaction was added
      window.dispatchEvent(new Event("transactionUpdated")); // 👈 This line triggers Reports.jsx to refresh

      alert("✅ Transaction added successfully!");

      // ✅ Clear form
      setTransaction({
        title: "",
        amount: "",
        category: "",
        type: "income",
        date: "",
      });

      // ✅ Redirect to dashboard or any page you want
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error adding transaction:", error);
      alert("Failed to add transaction. Please check backend connection.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="new-transaction-page">
      <div className="form-container">
        <h2>Add New Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter transaction title"
              value={transaction.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={transaction.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={transaction.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Health">Health</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Travel">Travel</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={transaction.type === "income"}
                  onChange={handleChange}
                />
                Income
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={transaction.type === "expense"}
                  onChange={handleChange}
                />
                Expense
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={transaction.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Add Transaction
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransaction;
