const express = require("express");
const router = express.Router();
const db = require("../../db");

// ============================================================
// GET ALL PRODUCTS
// ============================================================

router.get("/", (req, res) => {

    const sql = `
        SELECT
            p.*,
            c.Cat_Name,
            (p.P_Stock - p.P_Reserved) AS AvailableStock,
            COALESCE(AVG(f.F_Rating), 0) AS averageRating
        FROM Product p

        JOIN Category c
            ON p.Cat_ID = c.Cat_ID

        LEFT JOIN Feedback f
            ON p.P_ID = f.P_ID

        GROUP BY
            p.P_ID,
            c.Cat_Name
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                error: {
                    code: "DB_ERROR",
                    message: "Failed to fetch products",
                },
            });
        }

        return res.json({
            success: true,
            data: result,
        });
    });
});

// ============================================================
// GET PRODUCT BY ID
// ============================================================

router.get("/:id", (req, res) => {

    const sql = `
        SELECT
            p.*,
            c.Cat_Name,
            (p.P_Stock - p.P_Reserved) AS AvailableStock,
            COALESCE(AVG(f.F_Rating), 0) AS averageRating
        FROM Product p

        JOIN Category c
            ON p.Cat_ID = c.Cat_ID

        LEFT JOIN Feedback f
            ON p.P_ID = f.P_ID

        WHERE p.P_ID = ?

        GROUP BY
            p.P_ID,
            c.Cat_Name
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                error: {
                    code: "DB_ERROR",
                    message: "Failed to fetch product",
                },
            });
        }

        if (result.length === 0) {

            return res.status(404).json({
                success: false,
                error: {
                    code: "PRODUCT_NOT_FOUND",
                    message: "The requested product does not exist",
                },
            });
        }

        return res.json({
            success: true,
            data: result[0],
        });
    });
});

module.exports = router;