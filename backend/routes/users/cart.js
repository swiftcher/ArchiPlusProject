const express = require('express');


const router = express.Router();

const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');

// ADD TO Cart 

router.post('/', verifyToken, (req, res) => {

    const { P_ID } = req.body;
    const QuantityToAdd = req.body.increment; // or rename to quantity later
    const U_ID = req.user.U_ID;

    // 1. GET STOCK
    const stockSql = `
        SELECT P_Stock 
        FROM Product 
        WHERE P_ID = ?
    `;

    db.query(stockSql, [P_ID], (err, stockResult) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Stock check failed"
            });
        }

        if (stockResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const stock = stockResult[0].P_Stock;

        // 2. CHECK CART
        const cartSql = `
            SELECT Quantity 
            FROM Cart 
            WHERE U_ID = ? AND P_ID = ?
        `;

        db.query(cartSql, [U_ID, P_ID], (err2, cartResult) => {
            if (err2) {
                return res.status(500).json({
                    success: false,
                    message: "Cart check failed"
                });
            }

            let currentQty = 0;

            if (cartResult.length > 0) {
                currentQty = cartResult[0].Quantity;
            }

            const newQty = currentQty + QuantityToAdd;

            // 3. STOCK VALIDATION (IMPORTANT FIX)
            if (newQty > stock) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock"
                });
            }

            // 4. UPDATE OR INSERT
            if (cartResult.length > 0) {

                const updateSql = `
                    UPDATE Cart
                    SET Quantity = ?
                    WHERE U_ID = ? AND P_ID = ?
                `;

                db.query(updateSql, [newQty, U_ID, P_ID], (err3) => {
                    if (err3) {
                        return res.status(500).json({
                            success: false,
                            message: "Update failed"
                        });
                    }

                    return res.json({
                        success: true,
                        message: "Cart updated",
                        quantity: newQty 
                    });
                });

            } else {

                const insertSql = `
                    INSERT INTO Cart (U_ID, P_ID, Quantity)
                    VALUES (?, ?, ?)
                `;

                db.query(insertSql, [U_ID, P_ID, QuantityToAdd], (err4) => {
                    if (err4) {
                        return res.status(500).json({
                            success: false,
                            message: "Insert failed"
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "Added to cart"
                    });
                });
            }
        });
    });
});


// GET USER CART 

router.get('/userCart', verifyToken, (req, res) => {
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

router.delete('/:P_ID', verifyToken, (req, res) => {

    const P_ID = req.params.P_ID;
    const U_ID = req.user.U_ID;

    const sql = `
        DELETE FROM Cart
        WHERE P_ID = ? AND U_ID = ?
    `;

    db.query(sql, [P_ID, U_ID], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: { code: "DB_ERROR", message: "Delete failed" }
            });
        }

        return res.json({
            success: true,
            message: "Item removed from cart"
        });
    });
});

router.patch('/decrease/:P_ID', verifyToken, (req, res) => {

    const P_ID = req.params.P_ID;
    const U_ID = req.user.U_ID;

    // 1. check current quantity
    const getSql = `
        SELECT Quantity 
        FROM Cart 
        WHERE U_ID = ? AND P_ID = ?
    `;

    db.query(getSql, [U_ID, P_ID], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "DB error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not in cart"
            });
        }

        const currentQty = result[0].Quantity;

        // 2. if quantity is 1 → delete row
        if (currentQty <= 1) {

            const deleteSql = `
                DELETE FROM Cart
                WHERE U_ID = ? AND P_ID = ?
            `;

            db.query(deleteSql, [U_ID, P_ID], (err2) => {

                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: "Delete failed"
                    });
                }

                return res.json({
                    success: true,
                    message: "Item removed from cart"
                });
            });

        } 
        // 3. else decrease quantity
        else {

            const updateSql = `
                UPDATE Cart
                SET Quantity = Quantity - 1
                WHERE U_ID = ? AND P_ID = ?
            `;

            db.query(updateSql, [U_ID, P_ID], (err3) => {

                if (err3) {
                    return res.status(500).json({
                        success: false,
                        message: "Update failed"
                    });
                }

                return res.json({
                    success: true,
                    message: "Quantity decreased"
                });
            });
        }
    });
});
module.exports = router;