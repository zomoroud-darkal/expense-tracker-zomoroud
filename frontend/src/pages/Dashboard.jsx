import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    window.location.href = "/login";
    return null;
  }

  const userId = storedUser.id;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const incomeRes = await axios.get(
        `http://localhost:5000/api/income/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const expenseRes = await axios.get(
        `http://localhost:5000/api/expenses/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const incomes = incomeRes.data;
      const expenses = expenseRes.data;

      setTransactions([
        ...incomes.map((i) => ({ ...i, type: "Income" })),
        ...expenses.map((e) => ({ ...e, type: "Expense" })),
      ]);

      const totalInc = incomes.reduce((sum, i) => sum + i.amount, 0);
      const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
      const bal = totalInc - totalExp;

      setTotalIncome(totalInc);
      setTotalExpenses(totalExp);
      setBalance(bal);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const spendingPercent = totalIncome
    ? ((totalExpenses / totalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome back, {storedUser.name}! 👋</h1>
      <p className="dashboard-subtitle">
        Here’s your  overall financial overview 💰
      </p>

      
      <div className="summary-cards">
        <div className="card income-card">
          <h3>Total Income</h3>
          <p>+{totalIncome}€</p>
        </div>

        <div className="card expense-card">
          <h3>Total Expenses</h3>
          <p>-{totalExpenses}€</p>
        </div>

        <div className="card balance-card">
          <h3>Balance</h3>
          <p>{balance}€</p>
        </div>
      </div>

      
      <div className="spending-box">
        <h3>Spending Overview</h3>
        <p>You’ve spent {spendingPercent}% of your income so far.</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${spendingPercent}%` }}
          ></div>
        </div>
      </div>

    
      <div className="table-box">
        <h3>Recent Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount (€)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((t, index) => (
                  <tr key={index}>
                    <td>{t.date}</td>
                    <td>{t.category}</td>
                    <td
                      style={{
                        color: t.type === "Income" ? "lightgreen" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {t.type}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {t.type === "Income" ? "+" : "-"}
                      {t.amount}€
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
