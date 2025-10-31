// src/pages/TransactionHistory.jsx
import React, { useEffect, useState } from "react";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  // Load transactions from localStorage (or API if connected)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(stored);
  }, []);

  // Group transactions by date (Today, Yesterday, others)
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
     

      <div className="filter-bar">
        <select>
          <option>All</option>
          <option>Food</option>
          <option>Shopping</option>
          <option>Travel</option>
        </select>
        <input type="text" placeholder="Search transactions" />
      </div>

      {Object.keys(groupedTransactions).length === 0 ? (
        <p className="no-transactions">No transactions found</p>
      ) : (
        Object.keys(groupedTransactions).map((dateKey) => (
          <div key={dateKey} className="date-section">
            <h3 className="date-header">{dateKey}</h3>
            {groupedTransactions[dateKey].map((t, index) => (
              <div key={index} className="transaction-card">
                <div className="transaction-info">
                  <strong>{t.category}</strong>
                  <p>{t.description || "No description"}</p>
                </div>
                <div
                  className={`transaction-amount ${
                    t.type === "expense" ? "expense" : "income"
                  }`}
                >
                  {t.type === "expense" ? "- " : "+ "}Rs. {t.amount}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
