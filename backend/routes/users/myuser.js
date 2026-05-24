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
                data: result[0] 
            });
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: { message: "Server error" }
        });
    }
});


router.put('/profile', verifyToken, async (req, res) => {
    try {
        const U_ID = req.user.U_ID;

        const { name, lastName, password } = req.body;

        if (!name || !lastName) {
            return res.status(400).json({
                success: false,
                error: { message: "Name and last name are required" }
            });
        }

        let sql;
        let params;

        if (password && password.trim() !== "") {

            const hashedPassword = await require('bcrypt').hash(password, 10);

            sql = `
                UPDATE Users 
                SET U_Name = ?, U_lastName = ?, U_Password = ?
                WHERE U_ID = ?
            `;

            params = [name, lastName, hashedPassword, U_ID];

        } else {

            sql = `
                UPDATE Users 
                SET U_Name = ?, U_lastName = ?
                WHERE U_ID = ?
            `;

            params = [name, lastName, U_ID];
        }

        db.query(sql, params, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: { message: "Failed to update user" }
                });
            }

            return res.json({
                success: true,
                message: "Profile updated successfully"
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