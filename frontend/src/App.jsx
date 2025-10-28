import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Register from "./register.jsx";
import Login from "./login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Income from "./pages/Income.jsx";
import Expenses from "./pages/Expenses.jsx";
import Reports from "./pages/Reports.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
  <nav className="navbar">
  
 

 

 
  {currentPath !== "/register" && currentPath !== "/login" && (
    <>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/income">Income</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/reports">Reports</Link>
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </>
  )}
</nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;