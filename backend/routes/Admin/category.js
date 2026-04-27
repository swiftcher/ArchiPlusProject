const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');


// CREATE CATEGORY

router.post('/', verifyToken, isAdmin, (req, res) => {
    const { Cat_Name } = req.body;

    const sql = `INSERT INTO Category (Cat_Name) VALUES (?)`;

    db.query(sql, [Cat_Name], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            success: true,
            data: { Cat_ID: result.insertId }
        });
    });
});

// UPDATE CATEGORY

router.put('/:id', verifyToken, isAdmin, (req, res) => {
    const sql = `
        UPDATE Category
        SET Cat_Name = ?
        WHERE Cat_ID = ?
    `;

    db.query(sql, [req.body.Cat_Name, req.params.id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, message: "Category updated" });
    });
});

// DELETE CATEGORY

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
    const sql = `DELETE FROM Category WHERE Cat_ID = ?`;

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, message: "Category deleted" });
    });
});

// GET ALL CATEGORIES

router.get('/', (req, res) => {
    const sql = `SELECT * FROM Category`;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});

module.exports = router;