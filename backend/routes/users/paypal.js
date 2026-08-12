const express = require("express");
const router = express.Router();

const db = require("../../db");
const verifyToken = require("../../middleware/authMiddleware");

const PAYPAL_BASE_URL =
    process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";


// ============================================================
// GET PAYPAL ACCESS TOKEN
// ============================================================

async function getPayPalAccessToken() {

    const credentials = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
        `${PAYPAL_BASE_URL}/v1/oauth2/token`,
        {
            method: "POST",

            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: "grant_type=client_credentials"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("PayPal token error:", data);

        throw new Error("Could not authenticate with PayPal");
    }

    return data.access_token;
}


// ============================================================
// CREATE PAYPAL ORDER
// ============================================================

router.post("/create-order", verifyToken, async (req, res) => {

    const { O_ID } = req.body;
    const U_ID = req.user.U_ID;

    if (!O_ID) {
        return res.status(400).json({
            success: false,
            message: "Order ID is required"
        });
    }

    try {

        // ----------------------------------------------------
        // Get order and verify ownership
        // ----------------------------------------------------

        const orderSql = `
            SELECT
                o.O_ID,
                o.U_ID,
                o.O_Status,
                o.O_PaymentStatus,
                SUM(p.P_Price * op.Quantity) AS Total
            FROM Orders o
            JOIN Order_Product op
                ON o.O_ID = op.O_ID
            JOIN Product p
                ON op.P_ID = p.P_ID
            WHERE o.O_ID = ?
              AND o.U_ID = ?
            GROUP BY
                o.O_ID,
                o.U_ID,
                o.O_Status,
                o.O_PaymentStatus
        `;

        const [orders] = await db.promise().query(
            orderSql,
            [O_ID, U_ID]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const order = orders[0];

        // ----------------------------------------------------
        // Make sure payment has not already happened
        // ----------------------------------------------------

        if (order.O_PaymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Order is already paid"
            });
        }

        const total = Number(order.Total).toFixed(2);

        // ----------------------------------------------------
        // Get PayPal access token
        // ----------------------------------------------------

        const accessToken = await getPayPalAccessToken();

        // ----------------------------------------------------
        // Create PayPal order
        // ----------------------------------------------------

        const paypalResponse = await fetch(
            `${PAYPAL_BASE_URL}/v2/checkout/orders`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },

                body: JSON.stringify({
                    intent: "CAPTURE",

                    purchase_units: [
                        {
                            reference_id: String(O_ID),

                            amount: {
                                currency_code: "USD",
                                value: total
                            }
                        }
                    ]
                })
            }
        );

        const paypalOrder = await paypalResponse.json();

        if (!paypalResponse.ok) {

            console.error(
                "PayPal create order error:",
                paypalOrder
            );

            return res.status(500).json({
                success: false,
                message: "Could not create PayPal order"
            });
        }

        // ----------------------------------------------------
        // Save PayPal order ID
        // ----------------------------------------------------

        await db.promise().query(
            `
            UPDATE Orders
            SET O_PayPalOrderID = ?
            WHERE O_ID = ?
            `,
            [
                paypalOrder.id,
                O_ID
            ]
        );

        return res.json({
            success: true,
            paypalOrderID: paypalOrder.id
        });

    } catch (error) {

        console.error("Create PayPal order error:", error);

        return res.status(500).json({
            success: false,
            message: "PayPal order creation failed"
        });
    }
});


// ============================================================
// CAPTURE PAYPAL ORDER
// ============================================================

router.post("/capture-order", verifyToken, async (req, res) => {

    const { O_ID, paypalOrderID } = req.body;
    const U_ID = req.user.U_ID;

    if (!O_ID || !paypalOrderID) {
        return res.status(400).json({
            success: false,
            message: "Order ID and PayPal Order ID are required"
        });
    }

    try {

        // ----------------------------------------------------
        // Verify order belongs to current user
        // ----------------------------------------------------

        const [orders] = await db.promise().query(
            `
            SELECT
                O_ID,
                U_ID,
                O_Status,
                O_PaymentStatus,
                O_PayPalOrderID
            FROM Orders
            WHERE O_ID = ?
              AND U_ID = ?
            `,
            [O_ID, U_ID]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const order = orders[0];

        // ----------------------------------------------------
        // Verify PayPal order ID
        // ----------------------------------------------------

        if (order.O_PayPalOrderID !== paypalOrderID) {
            return res.status(400).json({
                success: false,
                message: "PayPal order does not match"
            });
        }

        // ----------------------------------------------------
        // Already paid?
        // ----------------------------------------------------

        if (order.O_PaymentStatus === "Paid") {
            return res.json({
                success: true,
                message: "Order already paid"
            });
        }

        // ----------------------------------------------------
        // Get PayPal token
        // ----------------------------------------------------

        const accessToken = await getPayPalAccessToken();

        // ----------------------------------------------------
        // CAPTURE PAYMENT
        // ----------------------------------------------------

        const captureResponse = await fetch(
            `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderID}/capture`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );

        const captureData = await captureResponse.json();

        console.log("PayPal capture:", captureData);

        // ----------------------------------------------------
        // Payment failed
        // ----------------------------------------------------

        if (!captureResponse.ok) {

            console.error(
                "PayPal capture failed:",
                captureData
            );

            return res.status(400).json({
                success: false,
                message: "Payment failed"
            });
        }

        // ----------------------------------------------------
        // IMPORTANT:
        // PayPal must say COMPLETED
        // ----------------------------------------------------

        if (captureData.status !== "COMPLETED") {

            return res.status(400).json({
                success: false,
                message: "Payment was not completed",
                paypalStatus: captureData.status
            });
        }

        // ====================================================
        // PAYMENT SUCCESS
        //
        // NOW we permanently sell the stock.
        // ====================================================

        const connection = await db.promise().getConnection();

        try {

            await connection.beginTransaction();

            // ------------------------------------------------
            // Lock order
            // ------------------------------------------------

            const [lockedOrders] = await connection.query(
                `
                SELECT
                    O_ID,
                    O_Status,
                    O_PaymentStatus
                FROM Orders
                WHERE O_ID = ?
                FOR UPDATE
                `,
                [O_ID]
            );

            if (lockedOrders.length === 0) {
                throw new Error("Order not found");
            }

            // ------------------------------------------------
            // Get order products and LOCK them
            // ------------------------------------------------

            const [items] = await connection.query(
                `
                SELECT
                    op.P_ID,
                    op.Quantity,
                    p.P_Stock,
                    p.P_Reserved
                FROM Order_Product op
                JOIN Product p
                    ON op.P_ID = p.P_ID
                WHERE op.O_ID = ?
                FOR UPDATE
                `,
                [O_ID]
            );

            // ------------------------------------------------
            // Permanently sell stock
            //
            // P_Stock decreases
            // P_Reserved decreases
            // ------------------------------------------------

            for (const item of items) {

                if (item.P_Reserved < item.Quantity) {
                    throw new Error(
                        `Invalid reservation for product ${item.P_ID}`
                    );
                }

                const updateStockSql = `
                    UPDATE Product
                    SET
                        P_Stock = P_Stock - ?,
                        P_Reserved = P_Reserved - ?
                    WHERE P_ID = ?
                `;

                await connection.query(
                    updateStockSql,
                    [
                        item.Quantity,
                        item.Quantity,
                        item.P_ID
                    ]
                );
            }

            // ------------------------------------------------
            // Mark payment as paid
            // ------------------------------------------------

            await connection.query(
                `
                UPDATE Orders
                SET
                    O_PaymentStatus = 'Paid',
                    O_Status = 'Confirmed'
                WHERE O_ID = ?
                `,
                [O_ID]
            );

            // ------------------------------------------------
            // COMMIT
            // ------------------------------------------------

            await connection.commit();

            connection.release();

            return res.json({
                success: true,
                message: "Payment completed successfully",
                O_ID: O_ID,
                paymentStatus: "Paid",
                orderStatus: "Confirmed"
            });

        } catch (transactionError) {

            await connection.rollback();
            connection.release();

            console.error(
                "Inventory transaction failed:",
                transactionError
            );

            return res.status(500).json({
                success: false,
                message: "Payment succeeded but inventory update failed"
            });
        }

    } catch (error) {

        console.error(
            "Capture PayPal order error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Payment processing failed"
        });
    }
});


module.exports = router;