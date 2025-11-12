import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserBadge from "../components/UserBadge";
import axios from "axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFire,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [zone, setZone] = useState("Safe");

  const location = useLocation();

  // ✅ Fetch transactions
  const fetchTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user?.email;

      if (!userEmail) {
        console.warn("⚠️ No user email found.");
        setTransactions([]);
        setIncome(0);
        setExpense(0);
        setBalance(0);
        setCategoryData([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/transactions?email=${userEmail}`
      );

      const data = response.data || [];
      setTransactions(data);

      const totalIncome = data
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpense = data
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setIncome(totalIncome);
      setExpense(totalExpense);
      setBalance(totalIncome - totalExpense);

      // ✅ Determine zone
      const ratio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
      if (ratio < 50) setZone("Safe");
      else if (ratio < 80) setZone("Warning");
      else setZone("Danger");

      // ✅ Category-wise expense data
      const categoryMap = {};
      data
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          categoryMap[t.category] =
            (categoryMap[t.category] || 0) + Number(t.amount);
        });

      const formattedCategoryData = Object.keys(categoryMap).map((key) => ({
        name: key,
        value: categoryMap[key],
      }));

      setCategoryData(formattedCategoryData);
    } catch (error) {
      console.error("❌ Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();

    const handleStorageChange = (event) => {
      if (event.key === "transactionUpdated") {
        fetchTransactions();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(fetchTransactions, 10000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [location]);

  // ✅ Chart data
  const summaryData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
    { name: "Balance", value: balance },
  ];

  const COLORS1 = ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"];
  const COLORS2 = ["#00C49F", "#FF8042", "#0088FE"];

  // ✅ Zone indicator colors
  const getZoneColor = () => {
    switch (zone) {
      case "Safe":
        return "linear-gradient(135deg, #00b894, #55efc4)";
      case "Warning":
        return "linear-gradient(135deg, #fdcb6e, #ffeaa7)";
      case "Danger":
        return "linear-gradient(135deg, #d63031, #ff7675)";
      default:
        return "#333";
    }
  };

  const getZoneIcon = () => {
    switch (zone) {
      case "Safe":
        return <FaCheckCircle size={30} color="#2ecc71" />;
      case "Warning":
        return <FaExclamationTriangle size={30} color="#f1c40f" />;
      case "Danger":
        return <FaFire size={30} color="#e74c3c" />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <UserBadge />

      {/* ✅ Zone Indicator */}
      <div className="zone-indicator" style={{ background: getZoneColor() }}>
        <div className="zone-content">
          {getZoneIcon()}
          <h4 className="zone-text">
            {zone === "Safe" && "✅ You are in the Safe Zone! Keep it up!"}
            {zone === "Warning" && "⚠️ Warning: Expenses are rising."}
            {zone === "Danger" && "🔥 Danger: Spending exceeds limits!"}
          </h4>
        </div>
      </div>

      {/* ✅ Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white dashboard-card">
            <div className="card-body">
              <h5>₹ {income}</h5>
              <p>
                Income <FaArrowUp />
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white dashboard-card">
            <div className="card-body">
              <h5>₹ {expense}</h5>
              <p>
                Expense <FaArrowDown />
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white dashboard-card">
            <div className="card-body">
              <h5>₹ {balance}</h5>
              <p>
                Cash in Hand <FaWallet />
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="card text-white dashboard-card"
            style={{ backgroundColor: "#9b59b6", border: "1px solid #8e44ad" }}
          >
            <div className="card-body">
              <h5>{transactions.length}</h5>
              <p>
                No. of Transactions <FaClipboardList />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Charts */}
      <div className="row mt-4">
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
                      <Cell
                        key={`cell-cat-${index}`}
                        fill={COLORS1[index % COLORS1.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e2a47",
                      border: "1px solid #555",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted">No expense data yet</p>
            )}
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm dark-card">
            <h5 className="mb-3 text-center text-light">
              Overall Financial Summary
            </h5>
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
                    <Cell
                      key={`cell-sum-${index}`}
                      fill={COLORS2[index % COLORS2.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e2a47",
                    border: "1px solid #555",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
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
