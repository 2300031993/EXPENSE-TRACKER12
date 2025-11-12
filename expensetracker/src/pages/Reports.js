// src/pages/Reports.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Reports.css";

const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFCD56", "#9966FF", "#FF6384"];

function formatDateISO(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toISOString();
}

function groupByMonthYear(items) {
  const map = {};
  items.forEach((t) => {
    const date = new Date(t.date);
    const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!map[ym]) map[ym] = { income: 0, expense: 0 };
    if (t.type === "income") map[ym].income += Number(t.amount);
    else map[ym].expense += Number(t.amount);
  });
  return map;
}

function groupByCategory(items) {
  const map = {};
  items.forEach((t) => {
    const cat = t.category || "Uncategorized";
    if (!map[cat]) map[cat] = 0;
    if (t.type === "expense") map[cat] += Number(t.amount);
  });
  return map;
}

function groupByPeriod(items, period = "weekly") {
  const map = {};
  items.forEach((t) => {
    const dt = new Date(t.date);
    if (isNaN(dt)) return;
    let key;
    if (period === "weekly") {
      const oneJan = new Date(dt.getFullYear(), 0, 1);
      const days = Math.floor((dt - oneJan) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((dt.getDay() + 1 + days) / 7);
      key = `${dt.getFullYear()}-W${String(week).padStart(2, "0")}`;
    } else if (period === "monthly") {
      key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = `${dt.getFullYear()}`;
    }
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    if (t.type === "income") map[key].income += Number(t.amount);
    else map[key].expense += Number(t.amount);
  });

  return Object.keys(map)
    .sort()
    .map((k) => ({ period: k, ...map[k] }));
}

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const userEmail =
    localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

  // ✅ FETCH transactions + listen for updates
  useEffect(() => {
    const fetchTx = async () => {
      setLoading(true);
      try {
        if (!userEmail) {
          setTransactions([]);
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:8081/api/transactions?email=${userEmail}`);

        const normalized = (res.data || []).map((t) => ({
          ...t,
          date: t.date ? formatDateISO(t.date) : new Date().toISOString(),
        }));
        setTransactions(normalized);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTx();

    // ✅ Listen for "transactionUpdated" event
    const handleTransactionUpdate = () => {
      fetchTx();
    };

    window.addEventListener("transactionUpdated", handleTransactionUpdate);
    return () => {
      window.removeEventListener("transactionUpdated", handleTransactionUpdate);
    };
  }, [userEmail]);

  // derived stats
  const totals = useMemo(() => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = groupByCategory(transactions);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const periodData = useMemo(
    () => groupByPeriod(transactions, period),
    [transactions, period]
  );

  const monthlyMap = useMemo(() => groupByMonthYear(transactions), [transactions]);
  const monthlyChartData = useMemo(
    () =>
      Object.keys(monthlyMap)
        .sort()
        .map((k) => ({ month: k, ...monthlyMap[k] })),
    [monthlyMap]
  );

  // Export Helpers
  const exportCSV = () => {
    const header = ["id", "title", "amount", "category", "type", "date", "userEmail"];
    const rows = transactions.map((t) => [
      t.id ?? "",
      t.title ?? "",
      t.amount ?? "",
      t.category ?? "",
      t.type ?? "",
      t.date ? new Date(t.date).toLocaleString() : "",
      t.userEmail ?? userEmail ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      transactions.map((t) => ({
        id: t.id ?? "",
        title: t.title ?? "",
        amount: t.amount ?? "",
        category: t.category ?? "",
        type: t.type ?? "",
        date: t.date ? new Date(t.date).toLocaleString() : "",
        userEmail: t.userEmail ?? userEmail ?? "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "transactions.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const title = "Transactions Summary";
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    doc.setFontSize(12);
    doc.text(`User: ${userEmail || "N/A"}`, 14, 30);
    doc.text(`Total Income: ₹ ${totals.income.toFixed(2)}`, 14, 38);
    doc.text(`Total Expense: ₹ ${totals.expense.toFixed(2)}`, 14, 46);
    doc.text(`Balance: ₹ ${totals.balance.toFixed(2)}`, 14, 54);

    const tableData = transactions.map((t) => [
      t.id ?? "",
      t.title ?? "",
      t.amount ?? "",
      t.category ?? "",
      t.type ?? "",
      t.date ? new Date(t.date).toLocaleString() : "",
    ]);
    doc.autoTable({
      startY: 65,
      head: [["ID", "Title", "Amount", "Category", "Type", "Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [30, 60, 120] },
    });

    doc.save("transactions_report.pdf");
  };

  const printSummary = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `
      <html>
        <head>
          <title>Transactions Summary</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color:#111; }
            h1 { color:#1f2937; }
            table { width:100%; border-collapse: collapse; margin-top: 12px;}
            th, td { border: 1px solid #ccc; padding: 8px; text-align:left; }
            th { background:#f3f4f6; }
            .summary { margin-top:12px; }
          </style>
        </head>
        <body>
          <h1>Transactions Summary</h1>
          <div class="summary">
            <div>Total Income: ₹ ${totals.income.toFixed(2)}</div>
            <div>Total Expense: ₹ ${totals.expense.toFixed(2)}</div>
            <div>Balance: ₹ ${totals.balance.toFixed(2)}</div>
          </div>
          <table>
            <thead><tr><th>ID</th><th>Title</th><th>Amount</th><th>Category</th><th>Type</th><th>Date</th></tr></thead>
            <tbody>
              ${transactions
                .map(
                  (t) => `<tr>
                <td>${t.id ?? ""}</td>
                <td>${t.title ?? ""}</td>
                <td>₹ ${t.amount ?? ""}</td>
                <td>${t.category ?? ""}</td>
                <td>${t.type ?? ""}</td>
                <td>${t.date ? new Date(t.date).toLocaleString() : ""}</td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  if (loading) return <div className="reports-page"><p>Loading reports…</p></div>;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <div className="reports-actions">
          <button onClick={exportCSV}>Export CSV</button>
          <button onClick={exportExcel}>Export Excel</button>
          <button onClick={exportPDF}>Export PDF</button>
          <button onClick={printSummary}>Print Summary</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h4>Total Income</h4>
          <p>₹ {totals.income.toLocaleString()}</p>
        </div>
        <div className="card">
          <h4>Total Expense</h4>
          <p>₹ {totals.expense.toLocaleString()}</p>
        </div>
        <div className="card">
          <h4>Balance</h4>
          <p>₹ {totals.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h4>Category-wise Spending</h4>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No expense category data</p>
          )}
        </div>

        <div className="chart-card">
          <h4>Expense vs Income (Monthly)</h4>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="expense" fill="#FF6384" name="Expense" />
                <Bar dataKey="income" fill="#00C49F" name="Income" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No monthly data</p>
          )}
        </div>
      </div>

      <div className="period-controls">
        <label>Report period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="period-table">
        <h4>{period.charAt(0).toUpperCase() + period.slice(1)} report</h4>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Income (₹)</th>
              <th>Expense (₹)</th>
              <th>Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {periodData.length === 0 && (
              <tr>
                <td colSpan={4} className="muted">
                  No data
                </td>
              </tr>
            )}
            {periodData.map((p) => (
              <tr key={p.period}>
                <td>{p.period}</td>
                <td>{p.income.toLocaleString()}</td>
                <td>{p.expense.toLocaleString()}</td>
                <td>{(p.income - p.expense).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
