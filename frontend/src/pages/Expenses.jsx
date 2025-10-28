import React, { useState, useEffect } from "react";
import axios from "axios";

function Expenses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
  });

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/expenses/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    if (userId) fetchExpenses();
  }, [userId]);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("Please fill all required fields!");
      return;
    }

    const newExpense = {
      user_id: userId,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/expenses",
        newExpense,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setExpenses([...expenses, res.data]);
      setFormData({ amount: "", category: "", date: "" });
      alert("✅ Expense added successfully!");
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("❌ Failed to add expense");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ color: "#4db5ff", marginBottom: "25px" }}>Add New Expense</h1>

    
      <div
        className="box"
        style={{
          maxWidth: "420px",
          width: "100%",
          textAlign: "left",
        }}
      >
        <form onSubmit={handleSubmit}>
          <label>Amount (€):</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />

          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>

          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div
        className="table-box"
        style={{
          marginTop: "30px",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#4db5ff", marginBottom: "15px" }}>Expense List</h3>
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount (€)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No expenses yet.
                </td>
              </tr>
            ) : (
              expenses.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.date}</td>
                  <td>{exp.category}</td>
                  <td style={{ color: "red" }}>-{Math.abs(exp.amount)} €</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;

