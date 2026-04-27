const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');

// DELETE USER 
router.delete('/users/:id', verifyToken, isAdmin, (req, res) => {
    const sql = `
        DELETE FROM Users
        WHERE U_ID = ? AND U_Role = 'customer'
    `;

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, message: "User deleted" });
    });
});

module.exports = router;