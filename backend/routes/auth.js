const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

  
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // البحث عن المستخدم
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    const { password: _pwd, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Token valid", userId: decoded.id });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
