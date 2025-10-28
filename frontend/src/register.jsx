import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ ضفناها

function Register() {
  const navigate = useNavigate(); // ✅ ضفناها

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setMessage("✅ " + res.data.message);
    navigate("/login");

      // تنظيف الحقول
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setMessage(
        "❌ " +
          (err.response?.data?.message || err.response?.data?.error || "Registration failed")
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Login
          </a>
        </p>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Register;
