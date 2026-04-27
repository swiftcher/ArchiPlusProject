const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');

//GET ALL SHIPPINGS
router.get('/', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT s.*, o.U_ID
        FROM Shipping s
        JOIN Orders o ON s.O_ID = o.O_ID
        ORDER BY s.S_ID DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch shipping data" }
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
});

// GET SHIPPING BY ID 
router.get('/:id', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT s.*, o.U_ID
        FROM Shipping s
        JOIN Orders o ON s.O_ID = o.O_ID
        WHERE s.S_ID = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch shipping" }
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                error: { message: "Shipping not found" }
            });
        }

        res.json({
            success: true,
            data: result[0]
        });
    });
});


//UPDATE SHIPPING
router.put('/:id', verifyToken, isAdmin, (req, res) => {
    const {
        S_ShippingStatus,
        S_ShippingDate,
        S_TrackingNumber,
        S_ShippingProvider
    } = req.body;

    const sql = `
        UPDATE Shipping
        SET 
            S_ShippingStatus = ?,
            S_ShippingDate = ?,
            S_TrackingNumber = ?,
            S_ShippingProvider = ?
        WHERE S_ID = ?
    `;

    db.query(sql, [
        S_ShippingStatus,
        S_ShippingDate,
        S_TrackingNumber,
        S_ShippingProvider,
        req.params.id
    ], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Update failed" }
            });
        }

        return res.json({
            success: true,
            data: { message: "Shipping updated" }
        });
    });
});

// QUICK UPDATE OF STATUS ONLY 
router.patch('/:id/status', verifyToken, isAdmin, (req, res) => {
    const { S_ShippingStatus } = req.body;

    const sql = `
        UPDATE Shipping
        SET S_ShippingStatus = ?
        WHERE S_ID = ?
    `;

    db.query(sql, [S_ShippingStatus, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Status update failed" }
            });
        }

        res.json({
            success: true,
            data: { message: "Status updated" }
        });
    });
});

module.exports = router;