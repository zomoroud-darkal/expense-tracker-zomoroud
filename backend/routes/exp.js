const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

router.get("/income/:user_id", verifyToken, async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM income WHERE user_id = $1 ORDER BY date DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/income", verifyToken, async (req, res) => {
  const { user_id, amount, category, date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO income (user_id, amount, category, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, amount, category, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/expenses/:user_id", verifyToken, async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/expenses", verifyToken, async (req, res) => {
  const { user_id, amount, category, date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO expenses (user_id, amount, category, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, amount, category, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;