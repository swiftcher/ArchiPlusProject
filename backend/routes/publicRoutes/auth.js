const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../../db');

const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { name,lastName, email, password } = req.body;

    const checkUser = "SELECT * FROM Users WHERE U_Email = ?";

    db.query(checkUser, [email], async (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO Users (U_Name,U_LastName, U_Email, U_Password, U_Role,U_IsVerified)
            VALUES (?, ?, ?,?, 'customer', 'False')
            
        `;

        db.query(sql, [name,lastName, email, hashedPassword], (err, result) => {
                    if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json(err);
        }

         const jwt = require("jsonwebtoken");

        const verificationToken = jwt.sign(
  
        { U_ID: result.insertId  },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );
        const verificationLink =
        `http://localhost:5173/verify-email?token=${verificationToken}`;


            res.json({ message: "User registered successfully" });
            console.log("link is : ", verificationLink)
        });
    });
});

router.post("/verify-email", async (req, res) => {

    const { token } = req.body;
    console.log("token is ",token)

    try {

        //  verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const userId = decoded.U_ID;
        console.log(userId)

        //  mark verified in DB
        const sql = `
            UPDATE Users
            SET U_IsVerified = true
            WHERE U_ID = ?
        `;

        db.query(sql, [userId], (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Email verified successfully"
            });
        });

    } catch (err) {

        console.error(err);

        res.status(400).json({
            message: "Invalid or expired token"
        });
    }
});




router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM Users WHERE U_Email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        // getting to this line means we found only matched mail yet
        const user = result[0];
        

        // clean password
        const cleanPassword = password.trim();

        //compare passwords 
        const isMatch = await bcrypt.compare(cleanPassword,user.U_Password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password!" });
        }
        // getting to this line means valid email and passwords
        // CREATE TOKEN
        const token = jwt.sign(
            {
                U_ID: user.U_ID,  
                email: user.U_Email,
                role: user.U_Role
            },
            process.env.JWT_SECRET,
            /*{ expiresIn: '15Mins' }*/
            { expiresIn: '1h'}

        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.U_ID,
                name: user.U_Name,
                lastName: user.U_LastName,
                email: user.U_Email,
                role: user.U_Role
            }
            
        });
    });
});
module.exports = router;