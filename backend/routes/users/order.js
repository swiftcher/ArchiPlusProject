const express = require("express");
const router = express.Router();

const db = require("../../db");
const verifyToken = require("../../middleware/authMiddleware");

// ============================================================
// GET USER ORDERS
// ============================================================

router.get("/", verifyToken, (req, res) => {
  const U_ID = req.user.U_ID;

  console.log("Getting orders for user:", U_ID);

  const sql = `
        SELECT *
        FROM Orders
        WHERE U_ID = ?
        ORDER BY O_Date DESC
    `;

  db.query(sql, [U_ID], (err, result) => {
    if (err) {
      console.error("Get orders error:", err);

      return res.status(500).json({
        success: false,
        error: {
          code: "DB_ERROR",
          message: "Failed to fetch orders",
        },
      });
    }

    if (result.length === 0) {
      return res.json({
        success: true,
        message: "no orders found",
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  });
});

// ============================================================
// CHECKOUT ORDER
// ============================================================

router.post("/checkout", verifyToken, (req, res) => {
  const U_ID = req.user.U_ID;

  console.log("Checkout started for user:", U_ID);

  // Get a dedicated database connection from the pool.
  db.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      console.error("Database connection error:", connectionErr);

      return res.status(500).json({
        success: false,
        error: {
          code: "DB_CONNECTION_ERROR",
          message: "Could not connect to database",
        },
      });
    }

    // ====================================================
    // START TRANSACTION
    // ====================================================

    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();

        console.error("Transaction start error:", transactionErr);

        return res.status(500).json({
          success: false,
          error: {
            code: "TRANSACTION_ERROR",
            message: "Could not start checkout transaction",
          },
        });
      }

      // ====================================================
      // 1. GET CART
      // ====================================================

      const cartSql = `
                SELECT
                    c.P_ID,
                    c.Quantity,
                    p.P_Price,
                    p.P_Name
                FROM Cart c
                JOIN Product p
                    ON c.P_ID = p.P_ID
                WHERE c.U_ID = ?
            `;

      connection.query(cartSql, [U_ID], (cartErr, cartItems) => {
        if (cartErr) {
          return connection.rollback(() => {
            connection.release();

            console.error("Cart query error:", cartErr);

            return res.status(500).json({
              success: false,
              error: {
                code: "CART_ERROR",
                message: "Could not read cart",
              },
            });
          });
        }

        // Empty cart
        if (cartItems.length === 0) {
          return connection.rollback(() => {
            connection.release();

            return res.status(400).json({
              success: false,
              error: {
                code: "CART_EMPTY",
                message: "Cart is empty",
              },
            });
          });
        }

        // ====================================================
        // 2. LOCK AND CHECK EVERY PRODUCT
        // ====================================================

        let productIndex = 0;

        const checkNextProduct = () => {
          // Finished checking all products
          if (productIndex >= cartItems.length) {
            return createOrder();
          }

          const item = cartItems[productIndex];

          const productSql = `
                            SELECT
                                P_ID,
                                P_Name,
                                P_Price,
                                P_Stock,
                                P_Reserved
                            FROM Product
                            WHERE P_ID = ?
                            FOR UPDATE
                        `;

          connection.query(productSql, [item.P_ID], (productErr, products) => {
            if (productErr) {
              return connection.rollback(() => {
                connection.release();

                console.error("Product query error:", productErr);

                return res.status(500).json({
                  success: false,
                  error: {
                    code: "PRODUCT_ERROR",
                    message: "Could not check product stock",
                  },
                });
              });
            }

            // Product doesn't exist
            if (products.length === 0) {
              return connection.rollback(() => {
                connection.release();

                return res.status(404).json({
                  success: false,
                  error: {
                    code: "PRODUCT_NOT_FOUND",
                    message: `Product ${item.P_ID} was not found`,
                  },
                });
              });
            }

            const product = products[0];

            // ====================================================
            // AVAILABLE = STOCK - RESERVED
            // ====================================================

            const availableStock = product.P_Stock - product.P_Reserved;

            console.log(
              `Product ${product.P_ID}:`,
              `Stock=${product.P_Stock}`,
              `Reserved=${product.P_Reserved}`,
              `Available=${availableStock}`,
              `Requested=${item.Quantity}`,
            );

            // Not enough available stock
            if (availableStock < item.Quantity) {
              return connection.rollback(() => {
                connection.release();

                return res.status(409).json({
                  success: false,
                  error: {
                    code: "INSUFFICIENT_STOCK",
                    message: `Not enough stock for ${product.P_Name}`,
                    available: availableStock,
                    requested: item.Quantity,
                  },
                });
              });
            }

            // Save product information
            // for later use.
            item.P_Stock = product.P_Stock;
            item.P_Reserved = product.P_Reserved;
            item.P_Name = product.P_Name;

            productIndex++;

            checkNextProduct();
          });
        };

        // ====================================================
        // 3. CREATE ORDER
        // ====================================================

        const createOrder = () => {
          const orderSql = `
                            INSERT INTO Orders
                            (
                                U_ID,
                                O_Status,
                                O_PaymentStatus
                            )
                            VALUES
                            (?, 'Pending', 'Pending')
                        `;

          connection.query(orderSql, [U_ID], (orderErr, orderResult) => {
            if (orderErr) {
              return connection.rollback(() => {
                connection.release();

                console.error("Order creation error:", orderErr);

                return res.status(500).json({
                  success: false,
                  error: {
                    code: "ORDER_FAILED",
                    message: "Could not create order",
                  },
                });
              });
            }

            const O_ID = orderResult.insertId;

            // ====================================================
            // 4. RESERVE STOCK
            // ====================================================

            let reserveIndex = 0;

            const reserveNextProduct = () => {
              if (reserveIndex >= cartItems.length) {
                return insertOrderItems(O_ID);
              }

              const item = cartItems[reserveIndex];

              const reserveSql = `
                                        UPDATE Product
                                        SET P_Reserved =
                                            P_Reserved + ?
                                        WHERE P_ID = ?
                                          AND (P_Stock - P_Reserved) >= ?
                                    `;

              connection.query(
                reserveSql,
                [item.Quantity, item.P_ID, item.Quantity],
                (reserveErr, reserveResult) => {
                  if (reserveErr) {
                    return connection.rollback(() => {
                      connection.release();

                      console.error("Reserve stock error:", reserveErr);

                      return res.status(500).json({
                        success: false,
                        error: {
                          code: "RESERVE_FAILED",
                          message: "Could not reserve stock",
                        },
                      });
                    });
                  }

                  // This should be exactly 1.
                  if (reserveResult.affectedRows !== 1) {
                    return connection.rollback(() => {
                      connection.release();

                      return res.status(409).json({
                        success: false,
                        error: {
                          code: "INSUFFICIENT_STOCK",
                          message: "Stock is no longer available",
                        },
                      });
                    });
                  }

                  reserveIndex++;

                  reserveNextProduct();
                },
              );
            };

            // ====================================================
            // 5. INSERT ORDER ITEMS
            // ====================================================

            const insertOrderItems = (O_ID) => {
              const orderItemsSql = `
                                        INSERT INTO Order_product
                                        (
                                            O_ID,
                                            P_ID,
                                            Quantity
                                        )
                                        VALUES ?
                                    `;

              const values = cartItems.map((item) => [
                O_ID,
                item.P_ID,
                item.Quantity,
              ]);

              connection.query(orderItemsSql, [values], (itemsErr) => {
                if (itemsErr) {
                  return connection.rollback(() => {
                    connection.release();

                    console.error("Order items error:", itemsErr);

                    return res.status(500).json({
                      success: false,
                      error: {
                        code: "ORDER_ITEMS_FAILED",
                        message: "Could not save order items",
                      },
                    });
                  });
                }

                // ====================================================
                // 6. CLEAR CART
                // ====================================================

                const clearCartSql = `
                                                DELETE FROM Cart
                                                WHERE U_ID = ?
                                            `;

                connection.query(clearCartSql, [U_ID], (clearErr) => {
                  if (clearErr) {
                    return connection.rollback(() => {
                      connection.release();

                      console.error("Clear cart error:", clearErr);

                      return res.status(500).json({
                        success: false,
                        error: {
                          code: "CART_CLEAR_FAILED",
                          message: "Could not clear cart",
                        },
                      });
                    });
                  }

                  // ====================================================
                  // 7. COMMIT
                  // ====================================================

                  connection.commit((commitErr) => {
                    if (commitErr) {
                      return connection.rollback(() => {
                        connection.release();

                        console.error("Commit error:", commitErr);

                        return res.status(500).json({
                          success: false,
                          error: {
                            code: "COMMIT_FAILED",
                            message: "Could not complete checkout",
                          },
                        });
                      });
                    }

                    // ====================================================
                    // TRANSACTION FINISHED
                    //
                    // Product locks are now released.
                    // ====================================================

                    connection.release();

                    return res.status(201).json({
                      success: true,
                      data: {
                        message: "Order created. Payment is pending.",
                        O_ID: O_ID,
                        orderStatus: "Pending",
                        paymentStatus: "Pending",
                      },
                    });
                  });
                });
              });
            };

            // Start reserving products
            reserveNextProduct();
          });
        };

        // Start checking products
        checkNextProduct();
      });
    });
  });
});

// ============================================================
// GET ORDER DETAILS
// ============================================================

router.get("/orderDetails/:id", verifyToken, (req, res) => {
  const O_ID = req.params.id;

  const sql = `
        SELECT
            o.O_ID,
            o.O_Status,
            o.O_PaymentStatus,
            o.O_Date,
            p.P_Name,
            p.P_Price AS UnitPrice,
            op.Quantity,
            (p.P_Price * op.Quantity) AS TotalPrice
        FROM Orders o
        JOIN Order_Product op
            ON o.O_ID = op.O_ID
        JOIN Product p
            ON op.P_ID = p.P_ID
        WHERE o.O_ID = ?
    `;

  db.query(sql, [O_ID], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: {
          code: "DB_ERROR",
          message: err.message,
        },
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  });
});

module.exports = router;
