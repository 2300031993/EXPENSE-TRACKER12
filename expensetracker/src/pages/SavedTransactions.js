import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SavedTransactions.css";

const SavedTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  return (
    <div className="saved-transactions-container">
      <h1 className="page-title">💾 Saved Transactions</h1>

      {transactions.length === 0 ? (
        <p className="no-data">No saved transactions yet...</p>
      ) : (
        <div className="transactions-grid">
          {transactions.map((txn) => (
            <div key={txn.id} className="transaction-card">
              <div className="txn-header">
                <span className="txn-type">
                  {txn.type === "income" ? "💰 Income" : "💸 Expense"}
                </span>
                <span
                  className={`txn-amount ${
                    txn.type === "income" ? "income" : "expense"
                  }`}
                >
                  ₹{txn.amount}
                </span>
              </div>
              <div className="txn-body">
                <p className="txn-description">{txn.description}</p>
                <p className="txn-email">👤 {txn.userEmail}</p>
                <p className="txn-date">
                  📅 {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTransactions;
