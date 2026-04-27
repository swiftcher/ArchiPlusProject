const express = require('express');
const router = express.Router();
const db = require('../../db'); // your mysql connection

const verifyToken = require('../publicRoutes/auth');
const isAdmin = require('../../middleware/roleAuthMiddleware');

// ADD PRODUCT
router.post('/', verifyToken, isAdmin, (req, res) => {
    const {
        Cat_ID,
        P_Name,
        P_Description,
        P_Price,
        P_Picture,
        P_Stock
    } = req.body;

    const sql = `
        INSERT INTO Product
        (Cat_ID, P_Name, P_Description, P_Price, P_Picture, P_Stock, P_Reserved)
        VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(sql,
        [Cat_ID, P_Name, P_Description, P_Price, P_Picture, P_Stock],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: {
                        code: "DB_ERROR",
                        message: "Failed to create product"
                    }
                });
            }

            return res.status(201).json({
                success: true,
                data: {
                    P_ID: result.insertId,
                    message: "Product created successfully"
                }
            });
        }
    );
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
        SET Cat_ID = ?,
            P_Name = ?,
            P_Description = ?,
            P_Price = ?,
            P_Picture = ?,
            P_Stock = ?
        WHERE P_ID = ?
    `;

    db.query(sql,
        [Cat_ID, P_Name, P_Description, P_Price, P_Picture, P_Stock, req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: {
                        code: "DB_ERROR",
                        message: "Failed to update product"
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

// DELETE PRODUCT

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
    const sql = `DELETE FROM Product WHERE P_ID = ?`;

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: "DB_ERROR",
                    message: "Failed to delete product"
                }
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "PRODUCT_NOT_FOUND",
                    message: "Product not found"
                }
            });
        }

        return res.json({
            success: true,
            data: {
                message: "Product deleted successfully"
            }
        });
    });
});

module.exports = router;