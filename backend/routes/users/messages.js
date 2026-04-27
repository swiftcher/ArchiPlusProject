const express = require('express');
const router = express.Router();


const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');

//SEND MESSAGE
router.post('/', verifyToken, (req, res) => {
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
                error: { code: "DB_ERROR", message: "Message failed" }
            });
        }

        return res.json({
            success: true,
            data: { message: "Message sent" }
        });
    });
});

// GET CONVERSATION
router.get('/:userId', verifyToken, (req, res) => {
    const currentUser = req.user.id;
    const otherUser = req.params.userId;

    const sql = `
        SELECT *
        FROM Messages
        WHERE 
            (Sender_ID = ? AND Receiver_ID = ?)
            OR
            (Sender_ID = ? AND Receiver_ID = ?)
        ORDER BY M_ID ASC
    `;

    db.query(sql, [currentUser, otherUser, otherUser, currentUser], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Failed to fetch messages" }
            });
        }

        return res.json({
            success: true,
            data: result
        });
    });
});

module.exports = router;