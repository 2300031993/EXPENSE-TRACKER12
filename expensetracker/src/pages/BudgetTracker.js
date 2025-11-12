import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Progress } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "antd/dist/reset.css";
import "./BudgetTracker.css";

export default function BudgetTracker() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);

  // ✅ Fetch budgets
  const fetchBudgets = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(
        `http://localhost:8081/api/budgets?email=${encodeURIComponent(userEmail)}`
      );
      setBudgets(res.data);
    } catch (err) {
      toast.error("Failed to fetch budgets");
    }
  }, [userEmail]);

  // ✅ Fetch all transactions (same data your History page uses)
  const fetchExpenses = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(
        `http://localhost:8081/api/transactions?email=${encodeURIComponent(userEmail)}`
      );
      setExpenses(res.data.filter((t) => t.type === "expense"));
    } catch (err) {
      toast.error("Failed to fetch expenses");
    }
  }, [userEmail]);

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, [fetchBudgets, fetchExpenses]);

  // ✅ Process data for chart & logic
  useEffect(() => {
    if (budgets.length === 0 || expenses.length === 0) return;

    const categoryData = budgets.map((b) => {
      const totalSpent = expenses
        .filter((t) => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);

      const percent = Math.min((totalSpent / b.amount) * 100, 100);
      let zone = "Safe Zone";
      let color = "#52c41a"; // green

      if (percent >= 100) {
        zone = "Red Zone";
        color = "#ff4d4f";
      } else if (percent >= 70) {
        zone = "Warning Zone";
        color = "#ffeb3b";
      }

      return {
        category: b.category,
        budget: b.amount,
        spent: totalSpent,
        percent,
        zone,
        color,
      };
    });

    setChartData(categoryData);
  }, [budgets, expenses]);

  // ✅ Dynamic color zones
  const COLORS = ["#52c41a", "#ffeb3b", "#ff4d4f"];

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h2>💰 Smart Budget Tracker</h2>
        <p className="subtitle">
          Automatically analyzes your spending and visualizes your financial health.
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="text-center text-muted">
          Add budgets and transactions to see your analysis.
        </p>
      ) : (
        <>
          {/* ✅ Category-Wise Budget Cards */}
          <div className="budget-grid">
            {chartData.map((data, i) => (
              <div
                key={i}
                className={`budget-card card-glass ${
                  data.zone === "Red Zone"
                    ? "over-budget"
                    : data.zone === "Warning Zone"
                    ? "near-budget"
                    : "under-budget"
                }`}
              >
                <div className="card-top">
                  <h5>{data.category}</h5>
                  <span className="month-tag">{data.zone}</span>
                </div>

                <p className="mb-1">
                  <strong>Budget:</strong> ₹{data.budget.toFixed(2)} <br />
                  <strong>Spent:</strong> ₹{data.spent.toFixed(2)}
                </p>

                <Progress
                  percent={data.percent}
                  strokeWidth={12}
                  strokeColor={data.color}
                  showInfo={false}
                />

                <p
                  className="mt-2 fw-semibold"
                  style={{
                    color: data.color,
                    fontSize: "0.95rem",
                  }}
                >
                  {data.zone === "Safe Zone" && "🟢 You're doing great!"}
                  {data.zone === "Warning Zone" && "⚠️ Spending approaching limit."}
                  {data.zone === "Red Zone" && "🚨 Over budget! Spend less this month."}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ Overall Spending Pie Chart */}
          <div className="chart-section">
            <h4>📊 Overall Spending Analysis</h4>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  fill="#8884d8"
                  label={({ category, percent }) =>
                    `${category} (${percent.toFixed(0)}%)`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
