// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet, FaClipboardList } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedTransactions);

    const totalIncome = savedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = savedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setIncome(totalIncome);
    setExpense(totalExpense);
    setBalance(totalIncome - totalExpense);

    // Prepare data for "Spending by Category"
    const categoryMap = {};
    savedTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
      });

    const formattedCategoryData = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    setCategoryData(formattedCategoryData);
  }, []);

  const summaryData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
    { name: "Balance", value: balance },
  ];

  const COLORS1 = ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"];
  const COLORS2 = ["#00C49F", "#FF8042", "#0088FE"];

  return (
    <div className="dashboard">
      {/* Dashboard Summary Cards */}
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100 dashboard-card">
            <div className="card-body">
              <h5>Rs. {income}</h5>
              <p>Income <FaArrowUp /></p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white h-100 dashboard-card">
            <div className="card-body">
              <h5>Rs. {expense}</h5>
              <p>Expense <FaArrowDown /></p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100 dashboard-card">
            <div className="card-body">
              <h5>Rs. {balance}</h5>
              <p>Cash in Hand <FaWallet /></p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="card text-white h-100 dashboard-card"
            style={{ backgroundColor: "#9b59b6", border: "1px solid #8e44ad" }}
          >
            <div className="card-body">
              <h5>{transactions.length}</h5>
              <p>No. of Transactions <FaClipboardList /></p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mt-4">
        {/* Chart 1: Category Breakdown */}
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm dark-card">
            <h5 className="mb-3 text-center text-light">Spending by Category</h5>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-cat-${index}`} fill={COLORS1[index % COLORS1.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", color: "#fff", borderRadius: "8px" }}
                  />
                  <Legend wrapperStyle={{ color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted">No expense data yet</p>
            )}
          </div>
        </div>

        {/* Chart 2: Income vs Expense vs Balance */}
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm dark-card">
            <h5 className="mb-3 text-center text-light">Overall Financial Summary</h5>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={summaryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-sum-${index}`} fill={COLORS2[index % COLORS2.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", color: "#fff", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
