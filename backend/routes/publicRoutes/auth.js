const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../../db');

const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const checkUser = "SELECT * FROM Users WHERE U_Email = ?";

    db.query(checkUser, [email], async (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO Users (U_Name, U_Email, U_Password, U_Role)
            VALUES (?, ?, ?, 'customer')
        `;

        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "User registered successfully" });
        });
    });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM Users WHERE U_Email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];
        console.log(user);

        // FIX 1: clean password
        const cleanPassword = password.trim();

        // FIX 2: compare correctly
        const isMatch = await bcrypt.compare(cleanPassword,user.U_Password);
        console.log(cleanPassword);
        console.log(user.U_Password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password!" });
        }

        // CREATE TOKEN
        const token = jwt.sign(
            {
                U_ID: user.U_ID,   // ⚠️ IMPORTANT FIX (see below)
                email: user.U_Email,
                role: user.U_Role
            },
            process.env.JWT_SECRET,
            { expiresIn: '15Mins' }
        );

        res.json({
            message: "Login successful",
            token
        });
    });
});
module.exports = router;