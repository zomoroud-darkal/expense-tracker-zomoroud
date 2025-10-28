const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const authRouter = require("./routes/auth");
const expRouter = require("./routes/exp");


const app = express();


app.use(cors());
app.use(express.json());


app.use("/auth", authRouter);
app.use("/api", expRouter);


app.listen(process.env.PORT || 5000, async () => {
  console.log("Server running on port ${process.env.PORT || 5000}");

  try {
    await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL Database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
});
