const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');

// CREATE SHIPPING AFTER ORDER
router.post('/', verifyToken, (req, res) => {
    const {
        O_ID,
        S_ShippingStatus,
        S_ShippingDate,
        S_TrackingNumber,
        S_ShippingProvider
    } = req.body;

    const sql = `
        INSERT INTO Shipping 
        (O_ID, S_ShippingStatus, S_ShippingDate, S_TrackingNumber, S_ShippingProvider)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        O_ID,
        S_ShippingStatus || 'Pending',
        S_ShippingDate,
        S_TrackingNumber,
        S_ShippingProvider
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Shipping creation failed" }
            });
        }

        return res.status(201).json({
            success: true,
            data: { S_ID: result.insertId }
        });
    });
});

//GET SHIPPING BY ORDER

router.get('/order/:id', verifyToken, (req, res) => {
    const sql = `
        SELECT * FROM Shipping WHERE O_ID = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Fetch failed" }
            });
        }

        return res.json({
            success: true,
            data: result
        });
    });
});

module.exports = router;