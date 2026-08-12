const express = require("express");
const router = express.Router();

const db = require("../../db");
const verifyToken = require("../../middleware/authMiddleware");

// ============================================================
// ADD FEEDBACK
// ============================================================

router.post("/", verifyToken, (req, res) => {
  const { P_ID, Rating, Comment } = req.body;
  const U_ID = req.user.id;

  const sql = `
        INSERT INTO Feedback
        (U_ID, P_ID, F_Rating, F_Comment, F_Date)
        VALUES (?, ?, ?, ?, NOW())
    `;

  db.query(sql, [U_ID, P_ID, Rating, Comment], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: {
          code: "DB_ERROR",
          message: "Failed to add feedback",
        },
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        message: "Feedback added",
        F_ID: result.insertId,
      },
    });
  });
});

// ============================================================
// GET FEEDBACK FOR ONE PRODUCT
// ============================================================

router.get("/product/:id", (req, res) => {
  const sql = `
        SELECT
            f.F_ID,
            f.P_ID,
            f.U_ID,
            f.F_Date,
            f.F_Comment,
            f.F_Rating,
            u.U_Name
        FROM Feedback f
        JOIN Users u
            ON f.U_ID = u.U_ID
        WHERE f.P_ID = ?
        ORDER BY f.F_Date DESC
    `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("GET PRODUCT FEEDBACK ERROR:", err);

      return res.status(500).json({
        success: false,
        error: {
          code: "DB_ERROR",
          message: "Failed to fetch feedback",
        },
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  });
});

module.exports = router;
