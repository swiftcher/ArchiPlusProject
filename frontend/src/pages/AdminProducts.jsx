import { useEffect, useMemo, useState } from "react";
import "./AdminProducts.css";

import { useAdminProductsViewModel } from "./useAdminProductViewModel";

export default function AdminProducts() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [search, setSearch] = useState("");

  const [newProduct, setNewProduct] = useState({
    Cat_ID: "",
    P_Name: "",
    P_Description: "",
    P_Price: "",
    P_Picture: "",
    P_Stock: "",
    P_Reserved:"",
  });

  const {
    products,
    loadProducts,
    deleteProduct,
    updateProduct,
    createProduct,
  } = useAdminProductsViewModel();

  useEffect(() => {
    loadProducts();
  }, []);

  /*
    ============================================================
    SEARCH PRODUCTS
    ============================================================
  */
const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
        return products;
    }

    // ============================================
    // STOCK SEARCH
    // Examples:
    // physical > 10
    // physical < 5
    // physical = 0
    // reserved > 3
    // reserved < 10
    // reserved = 0
    // ============================================

    const stockMatch = value.match(
        /^(physical|reserved)\s*(>=|<=|>|<|=)\s*(\d+)$/
    );

    if (stockMatch) {
        const [, type, operator, numberValue] = stockMatch;

        const target = Number(numberValue);

        return products.filter((product) => {
            const stock =
                type === "physical"
                    ? Number(product.P_Stock)
                    : Number(product.P_Reserved);

            switch (operator) {
                case ">":
                    return stock > target;

                case "<":
                    return stock < target;

                case ">=":
                    return stock >= target;

                case "<=":
                    return stock <= target;

                case "=":
                    return stock === target;

                default:
                    return false;
            }
        });
    }

    // ============================================
    // NORMAL SEARCH
    // ============================================

    return products.filter((product) => {
        const productName = String(
            product.P_Name || ""
        ).toLowerCase();

        const productId = String(
            product.P_ID || ""
        ).toLowerCase();

        return (
            productName.includes(value) ||
            productId.includes(value)
        );
    });

}, [products, search]);
  /*
    ============================================================
    RESET NEW PRODUCT
    ============================================================
  */

  const resetNewProduct = () => {
    setNewProduct({
      Cat_ID: "",
      P_Name: "",
      P_Description: "",
      P_Price: "",
      P_Picture: "",
      P_Stock: "",
    });
  };

  /*
    ============================================================
    SAVE NEW PRODUCT
    ============================================================
  */

  const saveNewProduct = async () => {
    const stock = Number(newProduct.P_Stock);

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be a whole number greater than or equal to 0.");
      return;
    }

    const price = Number(newProduct.P_Price);

    if (!Number.isFinite(price) || price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    const productToCreate = {
      ...newProduct,
      P_Price: price,
      P_Stock: stock,
    };

    await createProduct(productToCreate);

    setShowAddProduct(false);

    resetNewProduct();

    loadProducts();
  };

  /*
    ============================================================
    UPDATE PRODUCT
    ============================================================
  */

  const saveEditedProduct = async () => {
    if (!editProduct) {
      return;
    }

    const stock = Number(editProduct.P_Stock);
    const price = Number(editProduct.P_Price);

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be a whole number greater than or equal to 0.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    const productToUpdate = {
      ...editProduct,
      P_Price: price,
      P_Stock: stock,
    };

    await updateProduct(editProduct.P_ID, productToUpdate);

    setEditProduct(null);

    loadProducts();
  };

  /*
    ============================================================
    RETURN
    ============================================================
  */

  return (
    <div className="admin-products">
      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="products-header">
        <h1>Products Management</h1>

        <button
          className="add-product-btn"
          onClick={() => setShowAddProduct(true)}
        >
          + Add Product
        </button>
      </div>

      {/* ==================================================
          SEARCH BAR
          ================================================== */}

      <div className="products-search-wrapper">
        <input
          type="text"
          className="products-search"
          placeholder="Search name, ID, or: physical > 10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {search && (
          <button
            className="products-search-clear"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}
      </div>

      {/* ==================================================
          PRODUCTS LIST
          ================================================== */}

      <div className="products-list">
        {filteredProducts.length === 0 ? (
          <div className="products-no-results">
            {search
              ? "No products found matching your search."
              : "No products found."}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.P_ID}>
              {/* IMAGE */}

              {product.P_Picture ? (
                <img src={product.P_Picture} alt={product.P_Name} />
              ) : (
                <div className="no-image">No Image</div>
              )}

              {/* INFO */}

              <div className="product-info">
                <h3>{product.P_Name}</h3>

                <p>Product ID: #{product.P_ID}</p>

                <p>Category: {product.Cat_Name}</p>

                <p>Price: ${Number(product.P_Price).toFixed(2)}</p>

                <p>Physical Stock: {product.P_Stock}</p>

                <p>Reserved Stock: {product.P_Reserved ?? 0}</p>
              </div>

              {/* ACTIONS */}

              <div className="product-actions">
                <button
                  onClick={() =>
                    setEditProduct({
                      ...product,
                      P_Stock: Number(product.P_Stock) || 0,
                      P_Price: Number(product.P_Price) || 0,
                    })
                  }
                >
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => deleteProduct(product.P_ID)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ==================================================
          EDIT PRODUCT MODAL
          ================================================== */}

      {editProduct && (
        <div className="edit-overlay">
          <div className="edit-box">
            <h2>Edit Product</h2>

            {/* NAME */}

            <input
              placeholder="Product Name"
              value={editProduct.P_Name || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  P_Name: e.target.value,
                })
              }
            />

            {/* PRICE */}

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={editProduct.P_Price ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setEditProduct({
                    ...editProduct,
                    P_Price: "",
                  });

                  return;
                }

                const number = Number(value);

                // Negative price = automatically clear
                if (number < 0) {
                  setEditProduct({
                    ...editProduct,
                    P_Price: "",
                  });

                  return;
                }

                setEditProduct({
                  ...editProduct,
                  P_Price: value,
                });
              }}
            />

            {/* STOCK */}

            <input
              type="number"
              min="0"
              step="1"
              placeholder="Stock"
              value={editProduct.P_Stock ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                // Allow empty input
                if (value === "") {
                  setEditProduct({
                    ...editProduct,
                    P_Stock: "",
                  });

                  return;
                }

                const number = Number(value);

                // Negative stock = automatically clear
                if (number < 0) {
                  setEditProduct({
                    ...editProduct,
                    P_Stock: "",
                  });

                  return;
                }

                // Only allow whole numbers
                if (Number.isInteger(number)) {
                  setEditProduct({
                    ...editProduct,
                    P_Stock: number,
                  });
                }
              }}
            />

            <div className="modal-buttons">
              <button onClick={saveEditedProduct}>Save</button>

              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          ADD PRODUCT MODAL
          ================================================== */}

      {showAddProduct && (
        <div className="edit-overlay">
          <div className="edit-box">
            <h2>Add Product</h2>

            {/* PRODUCT NAME */}

            <input
              placeholder="Product Name"
              value={newProduct.P_Name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  P_Name: e.target.value,
                })
              }
            />

            {/* CATEGORY */}

            <input
              placeholder="Category ID"
              type="number"
              min="1"
              step="1"
              value={newProduct.Cat_ID}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  Cat_ID: e.target.value,
                })
              }
            />

            {/* DESCRIPTION */}

            <input
              placeholder="Description"
              value={newProduct.P_Description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  P_Description: e.target.value,
                })
              }
            />

            {/* PRICE */}

            <input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={newProduct.P_Price}
              onChange={(e) => {
                const value = e.target.value;

                // Allow empty input
                if (value === "") {
                  setNewProduct({
                    ...newProduct,
                    P_Price: "",
                  });

                  return;
                }

                const number = Number(value);

                // Negative price = automatically clear
                if (number < 0) {
                  setNewProduct({
                    ...newProduct,
                    P_Price: "",
                  });

                  return;
                }

                setNewProduct({
                  ...newProduct,
                  P_Price: value,
                });
              }}
            />

            {/* PICTURE */}

            <input
              placeholder="Picture URL"
              value={newProduct.P_Picture}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  P_Picture: e.target.value,
                })
              }
            />

            {/* STOCK */}

            <input
              placeholder="Stock"
              type="number"
              min="0"
              step="1"
              value={newProduct.P_Stock}
              onChange={(e) => {
                const value = e.target.value;

                // Allow empty input
                if (value === "") {
                  setNewProduct({
                    ...newProduct,
                    P_Stock: "",
                  });

                  return;
                }

                const number = Number(value);

                // Negative stock = automatically clear
                if (number < 0) {
                  setNewProduct({
                    ...newProduct,
                    P_Stock: "",
                  });

                  return;
                }

                // Only allow whole numbers
                if (Number.isInteger(number)) {
                  setNewProduct({
                    ...newProduct,
                    P_Stock: number,
                  });
                }
              }}
            />

            <div className="modal-buttons">
              <button onClick={saveNewProduct}>Create</button>

              <button
                onClick={() => {
                  setShowAddProduct(false);
                  resetNewProduct();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
