const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');

//GET ALL MESSAGES
router.get('/', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT m.*, 
        s.U_Name AS Sender_Name,
        r.U_Name AS Receiver_Name
        FROM Messages m
        JOIN User s ON m.Sender_ID = s.U_ID
        JOIN User r ON m.Receiver_ID = r.U_ID
        ORDER BY m.M_ID DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch messages" }
            });
        }

        res.json({ success: true, data: result });
    });
});

// REPLY TO MESSAGE (send message)
router.post('/', verifyToken, isAdmin, (req, res) => {
    const { Receiver_ID, M_Description } = req.body;
    const Sender_ID = req.user.id;

    const sql = `
        INSERT INTO Messages (Sender_ID, Receiver_ID, M_Description)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [Sender_ID, Receiver_ID, M_Description], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Message failed" }
            });
        }

        res.json({
            success: true,
            data: { message: "Reply sent" }
        });
    });
});

module.exports = router;