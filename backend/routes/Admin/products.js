const express = require('express');
const router = express.Router();
const db = require('../../db'); // your mysql connection

const verifyToken = require('../../middleware/authMiddleware');
const isAdmin = require('../../middleware/roleAuthMiddleware');

// GET ALL PRODUCTS

router.get('/', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT 
            p.P_ID,
            p.Cat_ID,
            p.P_Name,
            p.P_Description,
            p.P_Price,
            p.P_Picture,
            p.P_Stock,
            p.P_Reserved,
            c.Cat_Name

        FROM Product p

        JOIN Category c
            ON p.Cat_ID = c.Cat_ID

        ORDER BY p.P_ID DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch products"
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
});

// UPDATE PRODUCT
router.put('/:id', verifyToken, isAdmin, (req, res) => {

    const {
        Cat_ID,
        P_Name,
        P_Description,
        P_Price,
        P_Picture,
        P_Stock
    } = req.body;

    const sql = `
        UPDATE Product
        SET
            Cat_ID = ?,
            P_Name = ?,
            P_Description = ?,
            P_Price = ?,
            P_Picture = ?,
            P_Stock = ?
        WHERE P_ID = ?
    `;

    db.query(
        sql,
        [
            Cat_ID,
            P_Name,
            P_Description,
            P_Price,
            P_Picture,
            P_Stock,
            req.params.id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "UPDATE PRODUCT ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    error: {
                        code: "DB_ERROR",
                        message: err.message
                    }
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    error: {
                        code: "PRODUCT_NOT_FOUND",
                        message: "Product does not exist"
                    }
                });
            }

            return res.json({
                success: true,
                data: {
                    message: "Product updated successfully"
                }
            });
        }
    );
});

module.exports = router;