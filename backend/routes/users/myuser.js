const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');


// get me 
router.get('/', verifyToken, (req, res) => {
    
    try {
        if (!req.user?.U_ID) {
            return res.status(401).json({
                success: false,
                error: { message: "Unauthorized" }
            });
        }

        const U_ID = req.user.U_ID;

        const sql = `SELECT * FROM Users WHERE U_ID = ?`;

        db.query(sql, [U_ID], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: {
                        code: "DB_ERROR",
                        message: "Failed to fetch user"
                    }
                });
            }

            return res.json({
                success: true,
                data: result[0] // 👈 important fix
            });
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: { message: "Server error" }
        });
    }
});


module.exports = router;