const express = require('express');
const router = express.Router();

const db = require('../../db');
const verifyToken = require('../../middleware/authMiddleware');
const isAdmin = require('../../middleware/roleAuthMiddleware');

// GET ORDER BETWEEN DATES
router.get('/dashboard', verifyToken,isAdmin, (req,res)=>{


  const sql = `

    SELECT

    (SELECT COUNT(*) FROM Users) AS users,

    (SELECT COUNT(*) FROM Product) AS products,

    (SELECT COUNT(*) FROM Orders) AS orders,

    (
        SELECT COALESCE(SUM(op.Quantity * p.P_Price),0)
        FROM Order_Product op
        JOIN Product p 
        ON op.P_ID = p.P_ID
    ) AS revenue

`;

    db.query(sql,(err,result)=>{

        if(err){

            console.error(err);

            return res.status(500).json({
                success:false,
                message:"Dashboard data failed"
            });

        }


        res.json({

            success:true,

            data:result[0]

        });


    });


});

// ADMIN DASHBOARD DETAILS
router.get('/dashboard/details', verifyToken, isAdmin, (req,res)=>{


    const sql = `

    SELECT

    (
        SELECT COUNT(*)
        FROM Orders
        WHERE O_Status = 'Pending'
    ) AS pendingOrders,


    (
        SELECT COUNT(*)
        FROM Orders
        WHERE O_Status = 'Completed'
    ) AS completedOrders,


    (
        SELECT COUNT(*)
        FROM Product
        WHERE P_Stock < 5
    ) AS lowStockProducts;



    `;


    db.query(sql,(err,result)=>{


        if(err){

            console.error(err);

            return res.status(500).json({
                success:false,
                message:"Dashboard details failed"
            });

        }


        res.json({

            success:true,
            data:result[0]

        });


    });


});




// RECENT ORDERS
router.get('/dashboard/recent-orders', verifyToken, isAdmin,(req,res)=>{


    const sql = `

    SELECT 

    o.O_ID,
    o.O_Status,
    o.O_Date,
    u.U_Name,
    u.U_LastName,


    SUM(op.Quantity * p.P_Price) AS Total


    FROM Orders o


    JOIN Users u
    ON o.U_ID = u.U_ID


    JOIN Order_Product op
    ON o.O_ID = op.O_ID


    JOIN Product p
    ON op.P_ID = p.P_ID


    GROUP BY o.O_ID


    ORDER BY o.O_Date DESC


    LIMIT 5;


    `;



    db.query(sql,(err,result)=>{


        if(err){

            console.error(err);

            return res.status(500).json({
                success:false
            });

        }


        res.json({

            success:true,
            data:result

        });


    });


});

router.get('/orders/range', verifyToken, isAdmin, (req, res) => {
    const { from, to } = req.query;

    const sql = `
       SELECT
    o.O_ID,
    o.O_Date,
    o.O_Status,

    u.U_Name,
    u.U_LastName,
    u.U_Email,

    SUM(op.Quantity) AS Items,

    SUM(op.Quantity * p.P_Price) AS Total

FROM Orders o

JOIN Users u
ON o.U_ID = u.U_ID

JOIN Order_Product op
ON o.O_ID = op.O_ID

JOIN Product p
ON op.P_ID = p.P_ID

WHERE DATE(o.O_Date) BETWEEN ? AND ?

GROUP BY o.O_ID

ORDER BY o.O_Date ASC;
    `;

    db.query(sql, [from, to], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});

// GET ALL ORDERS SUMMARY 
router.get('/orders/summary', verifyToken, isAdmin, (req, res) => {
    const { from, to } = req.query;

    const sql = `
        SELECT 
            COUNT(DISTINCT o.O_ID) AS total_orders
        FROM Orders o
        WHERE o.O_Date BETWEEN ? AND ?
    `;

    db.query(sql, [from, to], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result[0] });
    });
});

// GET SHIPPINGS REPORT GROUPED BY SHIPPING_STATUS
router.get('/shipping', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT 
            S_ShippingStatus,
            COUNT(*) AS total
        FROM Shipping
        GROUP BY S_ShippingStatus
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});
// GET PRODUCTS REPORT GROUPED BY PRODUCT_ID DISPLAYED WITH AMOUNT OF TOTAL SELLS
router.get('/products', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT 
            p.P_ID,
            p.P_Name,
            p.P_Price,
            c.Cat_Name,
            SUM(op.Quantity) AS total_sold
        FROM Product p
        JOIN Category c ON p.Cat_ID = c.Cat_ID
        LEFT JOIN Order_Product op ON p.P_ID = op.P_ID
        GROUP BY p.P_ID
        ORDER BY total_sold DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});

// feedback report 
router.get('/feedback', verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT 
            Rating,
            COUNT(*) AS total
        FROM Feedback
        GROUP BY Rating
        ORDER BY Rating DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, data: result });
    });
});

module.exports = router;