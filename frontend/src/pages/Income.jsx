import React, { useState, useEffect } from "react";

function Income() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/income/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setIncomes(data);
      } catch (err) {
        console.error("Error fetching income:", err);
      }
    };

    if (userId) fetchIncome();
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

    const newIncome = {
      user_id: userId,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
    };

    try {
      const res = await fetch("http://localhost:5000/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newIncome),
      });

      if (!res.ok) throw new Error("Failed to add income");

      const data = await res.json();
      setIncomes([...incomes, data]);
      setFormData({ amount: "", category: "", date: "", notes: "" });
      alert("✅ Income added successfully!");
    } catch (err) {
      alert("❌ Failed to add income");
      console.error("Add income error:", err);
    }
  };

  return (
    <main className="page">
      <div className="box">
        <h1 style={{ textAlign: "center", color: "#4db5ff" }}>Add Income</h1>
        <form onSubmit={handleSubmit}>
          <label>Amount (€)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Bonus">Bonus</option>
            <option value="Other">Other</option>
          </select>

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Notes</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional"
          />

          <button type="submit" className="btn-block">
            Add Income
          </button>
        </form>
      </div>

      <div className="table-box">
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Income List
        </h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount (€)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {incomes.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", opacity: 0.6 }}>
                  No income records yet.
                </td>
              </tr>
            ) : (
              incomes.map((inc, index) => (
                <tr key={index}>
                  <td>{inc.date}</td>
                  <td>{inc.category}</td>
                  <td style={{ color: "#35e58b", fontWeight: "600" }}>
                    +{inc.amount} €
                  </td>
                  <td>{inc.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Income;
