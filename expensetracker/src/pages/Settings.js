// src/pages/Settings.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Settings() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");

  useEffect(()=> {
    const cats = JSON.parse(localStorage.getItem("categories")) || ["Food","Rent","Travel","Shopping","Bills","Salary"];
    setCategories(cats);
  }, []);

  const addCat = () => {
    if (!newCat.trim()) return toast.error("Enter category");
    if (categories.includes(newCat.trim())) return toast.warn("Already added");
    const updated = [...categories, newCat.trim()];
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    setNewCat("");
    toast.success("Added");
  };

  const removeCat = (c) => {
    const updated = categories.filter(x => x !== c);
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    toast.info("Removed");
  };

  return (
    <div>
      <h2 className="mb-3">Settings</h2>
      <div className="card-dark p-3 mb-3">
        <h5>Manage Categories</h5>
        <div className="d-flex mb-2">
          <input className="form-control me-2" value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category"/>
          <button className="btn btn-primary" onClick={addCat}>Add</button>
        </div>
        <div>
          {categories.map((c,i)=>(
            <div key={i} className="d-flex align-items-center justify-content-between mb-1">
              <div>{c}</div>
              <button className="btn btn-sm btn-outline-danger" onClick={()=>removeCat(c)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div className="card-dark p-3">
        <h5>Account</h5>
        <p>Currently signed in as: <strong>{JSON.parse(localStorage.getItem("user"))?.email || "N/A"}</strong></p>
        <button className="btn btn-warning" onClick={()=>{ localStorage.clear(); window.location.href="/login"; }}>Reset App (clear data)</button>
      </div>
    </div>
  );
}
