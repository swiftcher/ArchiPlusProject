const express = require('express');
const router = express.Router();
const db = require('../../db'); // your mysql connection

const verifyToken = require('../../middleware/authMiddleware');
const isAdmin = require('../../middleware/roleAuthMiddleware');

// GET ALL PRODUCTS
router.get('/', verifyToken, isAdmin, (req,res)=>{


    const sql = `

    SELECT 
    p.P_ID,
    p.Cat_ID,
    p.P_Name,
    p.P_Description,
    p.P_Price,
    p.P_Picture,
    p.P_Stock,
    c.Cat_Name,
    c.Cat_ID

    FROM Product p

    JOIN Category c
    ON p.Cat_ID = c.Cat_ID

    ORDER BY p.P_ID DESC

    `;


    db.query(sql,(err,result)=>{


        if(err){

            console.error(err);

            return res.status(500).json({

                success:false,
                message:"Failed to fetch products"

            });

        }


        res.json({

            success:true,
            data:result

        });


    });


});

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

    console.log("UPDATE PRODUCT ERROR:", err);

    return res.status(500).json({
        success:false,
        error:{
            code:"DB_ERROR",
            message:err.message
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

            console.log("DELETE PRODUCT ERROR:", err);

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