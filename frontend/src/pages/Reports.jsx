import React, { useState, useEffect } from "react";
import axios from "axios";

function Reports() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [reports, setReports] = useState([]);
  const [topIncomeThisMonth, setTopIncomeThisMonth] = useState(null);
  const [topExpenseThisMonth, setTopExpenseThisMonth] = useState(null);

  const fetchReports = async () => {
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

      const incomeData = incomeRes.data || [];
      const expenseData = expenseRes.data || [];

      // 🗓 الشهر الحالي
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // 🔹 بيانات الشهر الحالي فقط
      const incomeThisMonth = incomeData.filter((i) => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const expensesThisMonth = expenseData.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      // 🔹 تجميع حسب الفئة
      const groupSum = (rows, keyGetter) =>
        rows.reduce((acc, r) => {
          const key = keyGetter(r) || "Uncategorized";
          const amt = Number(r.amount || 0);
          acc[key] = (acc[key] || 0) + amt;
          return acc;
        }, {});

      // 🔝 أعلى مصدر دخل لهذا الشهر
      const incByCat = groupSum(incomeThisMonth, (r) => r.category || r.source);
      const topInc = Object.entries(incByCat).sort((a, b) => b[1] - a[1])[0];
      setTopIncomeThisMonth(
        topInc ? { name: topInc[0], amount: topInc[1] } : null
      );

      // 📉 أعلى فئة مصروف لهذا الشهر
      const expByCat = groupSum(expensesThisMonth, (r) => r.category);
      const topExp = Object.entries(expByCat).sort((a, b) => b[1] - a[1])[0];
      setTopExpenseThisMonth(
        topExp ? { name: topExp[0], amount: topExp[1] } : null
      );

      // 📅 تجميع شهري للجدول
      const months = {};
      incomeData.forEach((i) => {
        const month = new Date(i.date).toLocaleString("default", {
          month: "long",
        });
        months[month] = months[month] || { income: 0, expenses: 0 };
        months[month].income += Number(i.amount || 0);
      });

      expenseData.forEach((e) => {
        const month = new Date(e.date).toLocaleString("default", {
          month: "long",
        });
        months[month] = months[month] || { income: 0, expenses: 0 };
        months[month].expenses += Number(e.amount || 0);
      });

      const reportData = Object.keys(months).map((m) => ({
        month: m,
        income: months[m].income,
        expenses: months[m].expenses,
        balance: months[m].income - months[m].expenses,
      }));

      // 🔹 ترتيب الأشهر حسب التسلسل الزمني
      const monthOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      reportData.sort(
        (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      );

      setReports(reportData);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchReports();
  }, [userId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ color: "#4db5ff", marginBottom: "15px" }}>📊 Reports</h1>
      <p style={{ color: "#ccc", marginBottom: "30px" }}>
        Detailed monthly analysis of your income and expenses 💼
      </p>

      {/* ✅ البوكسات الخاصة بالشهر الحالي */}
      <div
        style={{
          display: "flex",
          gap: "25px",
          marginBottom: "40px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* 🔝 Top Income This Month */}
        <div
          className="box"
          style={{
            minWidth: "260px",
            textAlign: "center",
            padding: "25px",
            background: "#1e1e1e",
            borderRadius: "10px",
          }}
        >
          <h3>🔝 Top Income This Month</h3>
          <p style={{ fontSize: "1.1rem" }}>
            {topIncomeThisMonth ? (
              <>
                <strong>{topIncomeThisMonth.name}</strong> —{" "}
                <span style={{ color: "lightgreen" }}>
                  +{topIncomeThisMonth.amount}€
                </span>
              </>
            ) : (
              "No data this month"
            )}
          </p>
        </div>

        {/* 📉 Top Expense This Month */}
        <div
          className="box"
          style={{
            minWidth: "260px",
            textAlign: "center",
            padding: "25px",
            background: "#1e1e1e",
            borderRadius: "10px",
          }}
        >
          <h3>📉 Top Expense This Month</h3>
          <p style={{ fontSize: "1.1rem" }}>
            {topExpenseThisMonth ? (
              <>
                <strong>{topExpenseThisMonth.name}</strong> —{" "}
                <span style={{ color: "#ff5e5e" }}>
                  -{topExpenseThisMonth.amount}€
                </span>
              </>
            ) : (
              "No data this month"
            )}
          </p>
        </div>
      </div>

      {/* 📅 جدول الملخص الشهري */}
      <div
        className="table-box"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <h3
          style={{
            color: "#4db5ff",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          📅 Monthly Summary
        </h3>
        <p
          style={{
            color: "#999",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          A month-by-month overview of your financial performance
        </p>

        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Month</th>
              <th>Income (€)</th>
              <th>Expenses (€)</th>
              <th>Balance (€)</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No data available.
                </td>
              </tr>
            ) : (
              reports.map((r, i) => (
                <tr key={i}>
                  <td>{r.month}</td>
                  <td style={{ color: "lightgreen" }}>+{r.income}</td>
                  <td style={{ color: "#ff5e5e" }}>-{r.expenses}</td>
                  <td style={{ fontWeight: "bold" }}>{r.balance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
