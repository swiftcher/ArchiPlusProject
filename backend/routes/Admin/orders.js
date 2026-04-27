const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');

// GET ALL ORDERS
router.get('/', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT o.*, u.U_Name
        FROM Orders o
        JOIN User u ON o.U_ID = u.U_ID
        ORDER BY o.O_Date DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch orders" }
            });
        }

        res.json({ success: true, data: result });
    });
});

// GET ORDER DETAIL
router.get('/:id', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT o.O_ID, o.O_Status, o.O_Date,
        p.P_Name, op.Quantity, op.Price
        FROM Orders o
        JOIN Order_Product op ON o.O_ID = op.O_ID
        JOIN Product p ON op.P_ID = p.P_ID
        WHERE o.O_ID = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch order details" }
            });
        }

        res.json({ success: true, data: result });
    });
});

//UPDATE ORDER STATUS
router.put('/:id', verifyToken, isAdmin, (req, res) => {
    const { O_Status } = req.body;

    const sql = `
        UPDATE Orders
        SET O_Status = ?
        WHERE O_ID = ?
    `;

    db.query(sql, [O_Status, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to update order" }
            });
        }

        res.json({
            success: true,
            data: { message: "Order updated" }
        });
    });
});

module.exports = router;