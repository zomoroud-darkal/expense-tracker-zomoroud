import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ أضفنا Link

function Login() {
  const navigate = useNavigate(); // لنقل المستخدم بعد تسجيل الدخول

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);

      setMessage("✅ " + res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard"); // ✅ التوجيه بعد تسجيل الدخول
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="login-container" style={{ width: "350px", margin: "50px auto", textAlign: "center" }}>
      <h2>Welcome Back</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <button type="submit">Login</button>
      </form>

      {/* ✅ الجملة الجديدة تحت البوكس */}
      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "#61dafb", textDecoration: "none" }}>
          Register
        </Link>
      </p>

      <p>{message}</p>
    </div>
  );
}

export default Login;