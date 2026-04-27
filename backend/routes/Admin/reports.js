const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');

// GET ORDER BETWEEN DATES
router.get('/orders/range', verifyToken, isAdmin, (req, res) => {
    const { from, to } = req.query;

    const sql = `
        SELECT 
            O_ID,
            U_ID,
            O_Status,
            O_Date
        FROM Orders
        WHERE O_Date BETWEEN ? AND ?
        ORDER BY O_Date DESC
    `;

    db.query(sql, [from, to], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});

// GET ALL ORDERS SUMMARY 
router.get('/orders/summary', verifyToken, isAdmin, (req, res) => {
    const { from, to } = req.query;

    const sql = `
        SELECT 
            COUNT(DISTINCT o.O_ID) AS total_orders
        FROM Orders o
        WHERE o.O_Date BETWEEN ? AND ?
    `;

    db.query(sql, [from, to], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result[0] });
    });
});

// GET SHIPPINGS REPORT GROUPED BY SHIPPING_STATUS
router.get('/shipping', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT 
            S_ShippingStatus,
            COUNT(*) AS total
        FROM Shipping
        GROUP BY S_ShippingStatus
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});
// GET PRODUCTS REPORT GROUPED BY PRODUCT_ID DISPLAYED WITH AMOUNT OF TOTAL SELLS
router.get('/products', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT 
            p.P_ID,
            p.P_Name,
            p.P_Price,
            c.Cat_Name,
            SUM(op.Quantity) AS total_sold
        FROM Product p
        JOIN Category c ON p.Cat_ID = c.Cat_ID
        LEFT JOIN Order_Product op ON p.P_ID = op.P_ID
        GROUP BY p.P_ID
        ORDER BY total_sold DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});

// feedback report 
router.get('/feedback', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT 
            Rating,
            COUNT(*) AS total
        FROM Feedback
        GROUP BY Rating
        ORDER BY Rating DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});

module.exports = router;