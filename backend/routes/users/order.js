const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');


//GET USER ORDER

router.get('/', verifyToken, (req, res) => {
    console.log("log2" + req.user.U_ID);
    const U_ID = req.user.U_ID;

    const sql = `
        SELECT * FROM Orders
        WHERE U_ID = ?
        ORDER BY O_Date DESC
    `;

    db.query(sql, [U_ID], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: "DB_ERROR",
                    message: "Failed to fetch orders"
                }
            });
        }

        return res.json({
            success: true,
            data: result
        });
    });
});


// checkout order 

router.post('/checkout', verifyToken, (req, res) => {
    const U_ID = req.user.id;

    // 1. Get cart items
    const cartSql = `
        SELECT c.P_ID, c.Quantity, p.P_Price
        FROM Cart c
        JOIN Product p ON c.P_ID = p.P_ID
        WHERE c.U_ID = ?
    `;

    db.query(cartSql, [U_ID], (err, cartItems) => {
        if (err || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "CART_EMPTY",
                    message: "Cart is empty"
                }
            });
        }

        // 2. Create order
        const orderSql = `
            INSERT INTO Orders (U_ID, O_Status)
            VALUES (?, 'Pending')
        `;

        db.query(orderSql, [U_ID], (err2, orderResult) => {
            if (err2) {
                return res.status(500).json({
                    success: false,
                    error: {
                        code: "ORDER_FAILED",
                        message: "Could not create order"
                    }
                });
            }

            const O_ID = orderResult.insertId;

            // 3. Insert order items
            const orderItemsSql = `
                INSERT INTO Order_Product (O_ID, P_ID, Quantity, Price)
                VALUES ?
            `;

            const values = cartItems.map(item => [
                O_ID,
                item.P_ID,
                item.Quantity,
                item.P_Price
            ]);

            db.query(orderItemsSql, [values], (err3) => {
                if (err3) {
                    return res.status(500).json({
                        success: false,
                        error: {
                            code: "ORDER_ITEMS_FAILED",
                            message: "Could not save order items"
                        }
                    });
                }

                // 4. Clear cart
                const clearCartSql = `DELETE FROM Cart WHERE U_ID = ?`;

                db.query(clearCartSql, [U_ID]);

                return res.status(201).json({
                    success: true,
                    data: {
                        message: "Order placed successfully",
                        O_ID
                    }
                });
            });
        });
    });
});



// GET ORDER DETAILS

router.get('/:id', verifyToken, (req, res) => {
    const O_ID = req.params.id;

    const sql = `
        SELECT o.O_ID, o.O_Status, o.O_Date,
        p.P_Name, op.Quantity, op.Price
        FROM Orders o
        JOIN Order_Product op ON o.O_ID = op.O_ID
        JOIN Product p ON op.P_ID = p.P_ID
        WHERE o.O_ID = ?
    `;

    db.query(sql, [O_ID], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: "DB_ERROR",
                    message: "Failed to fetch order"
                }
            });
        }

        return res.json({
            success: true,
            data: result
        });
    });
});

module.exports = router;