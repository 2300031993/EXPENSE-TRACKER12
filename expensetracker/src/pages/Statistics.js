// src/pages/Statistics.js
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Statistics() {
  const [data, setData] = useState([]);
  const COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9B59B6", "#FF9F1C"];

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const expenseOnly = expenses.filter(e => e.type === "Expense");
    const grouped = {};
    expenseOnly.forEach(e => {
      grouped[e.category] = (grouped[e.category] || 0) + Number(e.amount || 0);
    });
    const chartData = Object.keys(grouped).map(k => ({ name: k, value: grouped[k] }));
    setData(chartData);
  }, []);

  return (
    <div>
      <h2 className="mb-3">Statistics</h2>
      <div className="card-dark p-3">
        {data.length === 0 ? <p>No expense data yet</p> : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
                  {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
