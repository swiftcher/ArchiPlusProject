const express = require("express");

const router = express.Router();

const db = require("../../db");
const verifyToken = require("../../middleware/authMiddleware");

// ============================================================
// ADD TO CART
// ============================================================

router.post("/", verifyToken, (req, res) => {
  const { P_ID } = req.body;
  const QuantityToAdd = Number(req.body.increment);
  const U_ID = req.user.U_ID;

  // Basic validation
  if (!P_ID || !QuantityToAdd || QuantityToAdd <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product or quantity",
    });
  }

  // 1. GET AVAILABLE STOCK
  const stockSql = `
        SELECT
            P_Stock,
            P_Reserved,
            (P_Stock - P_Reserved) AS AvailableStock
        FROM Product
        WHERE P_ID = ?
    `;

  db.query(stockSql, [P_ID], (err, stockResult) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Stock check failed",
      });
    }

    if (stockResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const availableStock = Number(stockResult[0].AvailableStock);

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
          message: "Cart check failed",
        });
      }

      let currentQty = 0;

      if (cartResult.length > 0) {
        currentQty = Number(cartResult[0].Quantity);
      }

      const newQty = currentQty + QuantityToAdd;

      // 3. CHECK AVAILABLE STOCK
      if (newQty > availableStock) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available",
          availableStock: availableStock,
        });
      }

      // 4. UPDATE EXISTING CART ITEM
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
              message: "Update failed",
            });
          }

          return res.json({
            success: true,
            message: "Cart updated",
            quantity: newQty,
          });
        });
      }

      // 5. INSERT NEW CART ITEM
      else {
        const insertSql = `
                    INSERT INTO Cart (U_ID, P_ID, Quantity)
                    VALUES (?, ?, ?)
                `;

        db.query(insertSql, [U_ID, P_ID, QuantityToAdd], (err4) => {
          if (err4) {
            return res.status(500).json({
              success: false,
              message: "Insert failed",
            });
          }

          return res.status(201).json({
            success: true,
            message: "Added to cart",
            quantity: QuantityToAdd,
          });
        });
      }
    });
  });
});

// ============================================================
// GET USER CART
// ============================================================

router.get("/userCart", verifyToken, (req, res) => {
  const U_ID = req.user.U_ID;

  const sql = `
        SELECT
            c.Cart_ID,
            c.Quantity,
            p.P_ID,
            p.P_Name,
            p.P_Price,
            p.P_Picture,
            p.P_Stock,
            p.P_Reserved,
            (p.P_Stock - p.P_Reserved) AS AvailableStock,
            (p.P_Price * c.Quantity) AS Total
        FROM Cart c
        JOIN Product p
            ON c.P_ID = p.P_ID
        WHERE c.U_ID = ?
    `;

  db.query(sql, [U_ID], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: {
          code: "DB_ERROR",
          message: "Failed to fetch cart",
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
// UPDATE CART QUANTITY
// ============================================================

router.put("/:id", verifyToken, (req, res) => {
  const Quantity = Number(req.body.Quantity);
  const Cart_ID = req.params.id;
  const U_ID = req.user.U_ID;

  if (!Quantity || Quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid quantity",
    });
  }

  // First find which product belongs to this cart item
  const cartSql = `
        SELECT P_ID
        FROM Cart
        WHERE Cart_ID = ? AND U_ID = ?
    `;

  db.query(cartSql, [Cart_ID, U_ID], (err, cartResult) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: {
          code: "DB_ERROR",
          message: "Cart lookup failed",
        },
      });
    }

    if (cartResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const P_ID = cartResult[0].P_ID;

    // Check current available stock
    const stockSql = `
            SELECT
                (P_Stock - P_Reserved) AS AvailableStock
            FROM Product
            WHERE P_ID = ?
        `;

    db.query(stockSql, [P_ID], (err2, stockResult) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: "Stock check failed",
        });
      }

      if (stockResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const availableStock = Number(stockResult[0].AvailableStock);

      if (Quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available",
          availableStock: availableStock,
        });
      }

      const updateSql = `
                UPDATE Cart
                SET Quantity = ?
                WHERE Cart_ID = ? AND U_ID = ?
            `;

      db.query(updateSql, [Quantity, Cart_ID, U_ID], (err3) => {
        if (err3) {
          return res.status(500).json({
            success: false,
            error: {
              code: "DB_ERROR",
              message: "Update failed",
            },
          });
        }

        return res.json({
          success: true,
          data: {
            message: "Cart updated",
            quantity: Quantity,
          },
        });
      });
    });
  });
});

// ============================================================
// DELETE ITEM
// ============================================================

router.delete("/:P_ID", verifyToken, (req, res) => {
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
        error: {
          code: "DB_ERROR",
          message: "Delete failed",
        },
      });
    }

    return res.json({
      success: true,
      message: "Item removed from cart",
    });
  });
});

// ============================================================
// DECREASE QUANTITY
// ============================================================

router.patch("/decrease/:P_ID", verifyToken, (req, res) => {
  const P_ID = req.params.P_ID;
  const U_ID = req.user.U_ID;

  const getSql = `
        SELECT Quantity
        FROM Cart
        WHERE U_ID = ? AND P_ID = ?
    `;

  db.query(getSql, [U_ID, P_ID], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "DB error",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not in cart",
      });
    }

    const currentQty = Number(result[0].Quantity);

    // If quantity is 1, remove the item
    if (currentQty <= 1) {
      const deleteSql = `
                DELETE FROM Cart
                WHERE U_ID = ? AND P_ID = ?
            `;

      db.query(deleteSql, [U_ID, P_ID], (err2) => {
        if (err2) {
          return res.status(500).json({
            success: false,
            message: "Delete failed",
          });
        }

        return res.json({
          success: true,
          message: "Item removed from cart",
        });
      });
    }

    // Otherwise decrease quantity
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
            message: "Update failed",
          });
        }

        return res.json({
          success: true,
          message: "Quantity decreased",
        });
      });
    }
  });
});

module.exports = router;
