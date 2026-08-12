const express = require("express");
const router = express.Router();

const db = require("../../db");

const verifyToken = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/roleAuthMiddleware");

// GET ALL ORDERS

router.get("/", verifyToken, isAdmin, (req, res) => {
  const sql = `

SELECT

o.O_ID,
o.O_Status,
o.O_Date,

u.U_Name,
u.U_LastName,
u.U_Email,

p.P_ID,
p.P_Name,
p.P_Price,

op.Quantity


FROM Orders o


JOIN Users u
ON o.U_ID = u.U_ID


JOIN Order_Product op
ON o.O_ID = op.O_ID


JOIN Product p
ON op.P_ID = p.P_ID



ORDER BY 
o.O_Date ASC


`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Failed loading orders",
      });
    }

    const orders = {};

    result.forEach((row) => {
      if (!orders[row.O_ID]) {
        orders[row.O_ID] = {
          O_ID: row.O_ID,
          O_Status: row.O_Status,
          O_Date: row.O_Date,

          customer: {
            name: row.U_Name + " " + row.U_LastName,

            email: row.U_Email,
          },

          products: [],
          total: 0,
        };
      }

      orders[row.O_ID].products.push({
        id: row.P_ID,
        name: row.P_Name,
        quantity: row.Quantity,
        price: row.P_Price,
      });

      orders[row.O_ID].total += row.Quantity * row.P_Price;
    });

    res.json({
      success: true,
      data: Object.values(orders),
    });
  });
});

// UPDATE STATUS

router.put("/:id/status", verifyToken, isAdmin, (req, res) => {
  const { status } = req.body;

  const sql = `

UPDATE Orders

SET O_Status=?

WHERE O_ID=?

`;

  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      message: "Status updated",
    });
  });
});

module.exports = router;
