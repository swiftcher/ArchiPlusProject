const express = require('express');


const router = express.Router();

const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');

// ADD TO Cart 

router.post('/', verifyToken, (req, res) => {
    
    const P_ID = req.body.P_ID;
    const Quantity = req.body.Quantity;

    const U_ID = req.user.U_ID;
    console.log("bb" + P_ID,Quantity,U_ID);

    const checkSql = `
        SELECT * FROM Cart 
        WHERE U_ID = ? AND P_ID = ?
    `;

    db.query(checkSql, [U_ID, P_ID], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Cart check failed" }
            });
        }

        // If product already in cart → update quantity
        if (result.length > 0) {
            const updateSql = `
                UPDATE Cart
                SET Quantity = Quantity + ?
                WHERE U_ID = ? AND P_ID = ?
            `;

            return db.query(updateSql, [Quantity, U_ID, P_ID], (err2) => {
                if (err2) {
                    return res.status(500).json({
                        success: false,
                        error: { code: "DB_ERROR", message: "Cart update failed" }
                    });
                }

                return res.json({
                    success: true,
                    data: { message: "Cart updated successfully" }
                });
            });
        }

        // If not exists → insert new
        const insertSql = `
            INSERT INTO Cart (U_ID, P_ID, Quantity)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [U_ID, P_ID, Quantity], (err3) => {
            if (err3) {
                return res.status(500).json({
                    success: false,
                    error: { code: "DB_ERROR", message: "Add to cart failed" }
                });
            }

            return res.status(201).json({
                success: true,
                data: { message: "Product added to cart" }
            });
        });
    });
});


// GET USER CART 

router.get('/', verifyToken, (req, res) => {
    const U_ID = req.user.U_ID;
    console.log(U_ID);

    const sql = `
        SELECT 
            c.Cart_ID,
            c.Quantity,
            p.P_ID,
            p.P_Name,
            p.P_Price,
            P.P_Picture,
            P.P_Stock,
            (p.P_Price * c.Quantity) AS Total
        FROM Cart c
        JOIN Product p ON c.P_ID = p.P_ID
        WHERE c.U_ID = ?
    `;

    db.query(sql, [U_ID], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Failed to fetch cart" }
            });
        }

        return res.json({
            success: true,
            data: result
        });
    });
});

//UPDATE QUANTITY

router.put('/:id', verifyToken, (req, res) => {
    const { Quantity } = req.body;
    const Cart_ID = req.params.id;
    const U_ID = req.user.id;

    const sql = `
        UPDATE Cart
        SET Quantity = ?
        WHERE Cart_ID = ? AND U_ID = ?
    `;

    db.query(sql, [Quantity, Cart_ID, U_ID], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Update failed" }
            });
        }

        return res.json({
            success: true,
            data: { message: "Cart updated" }
        });
    });
});

// DELETE ITEM

router.delete('/:id', verifyToken, (req, res) => {
    const Cart_ID = req.params.id;
    const U_ID = req.user.id;

    const sql = `
        DELETE FROM Cart
        WHERE Cart_ID = ? AND U_ID = ?
    `;

    db.query(sql, [Cart_ID, U_ID], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Delete failed" }
            });
        }

        return res.json({
            success: true,
            data: { message: "Item removed from cart" }
        });
    });
});

module.exports = router;