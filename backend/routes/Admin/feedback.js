const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');

//GET ALL FEEDBACKs
router.get('/', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT f.*, u.U_Name, p.P_Name
        FROM Feedback f
        JOIN User u ON f.U_ID = u.U_ID
        JOIN Product p ON f.P_ID = p.P_ID
        ORDER BY f.F_Date DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch feedback" }
            });
        }

        res.json({ success: true, data: result });
    });
});

//DELETE FEEDBACK
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
    const sql = `DELETE FROM Feedback WHERE F_ID = ?`;

    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { message: "Delete failed" }
            });
        }

        res.json({
            success: true,
            data: { message: "Feedback deleted" }
        });
    });
});


module.exports = router;