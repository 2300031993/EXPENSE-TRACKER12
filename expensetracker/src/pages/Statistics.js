import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Statistics.css";

export default function Statistics() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, savings: 0 });

  const COLORS = ["#00b894", "#0984e3", "#6c5ce7", "#e17055", "#fdcb6e", "#ff7675"];

  const fetchTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user?.email;

      if (!userEmail) {
        console.warn("⚠️ No user email found in localStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/transactions?email=${userEmail}`
      );

      const data = response.data || [];
      console.log("Fetched transactions:", data);

      setTransactions(data);
      processData(data);
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
    }
  };

  const processData = (data) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};
    const categoryMap = {};
    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((txn) => {
      const date = new Date(txn.date);
      if (isNaN(date)) return; // skip invalid dates

      const month = months[date.getMonth()];
      if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expense: 0 };

      if (txn.type === "income") {
        monthlyMap[month].income += Number(txn.amount);
        totalIncome += Number(txn.amount);
      } else if (txn.type === "expense") {
        monthlyMap[month].expense += Number(txn.amount);
        totalExpense += Number(txn.amount);
        categoryMap[txn.category] = (categoryMap[txn.category] || 0) + Number(txn.amount);
      }
    });

    setMonthlyData(Object.values(monthlyMap));
    setCategoryData(Object.entries(categoryMap).map(([name, value]) => ({ name, value })));
    setTotals({
      income: totalIncome,
      expense: totalExpense,
      savings: totalIncome - totalExpense,
    });
  };

  useEffect(() => {
    fetchTransactions();

    const handleStorageChange = (e) => {
      if (e.key === "transactionUpdated") fetchTransactions();
    };
    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(fetchTransactions, 10000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="statistics-page">
      <h2 className="stats-title">📊 Financial Statistics</h2>

      <div className="stats-cards">
        <div className="stats-card income">
          <h3>Total Income</h3>
          <p>₹{totals.income.toLocaleString()}</p>
        </div>
        <div className="stats-card expense">
          <h3>Total Expenses</h3>
          <p>₹{totals.expense.toLocaleString()}</p>
        </div>
        <div className="stats-card savings">
          <h3>Net Savings</h3>
          <p>₹{totals.savings.toLocaleString()}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>📅 Monthly Trends</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00b894" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#d63031" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No transaction data found.</p>
          )}
        </div>

        <div className="chart-box">
          <h3>💰 Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No category data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
