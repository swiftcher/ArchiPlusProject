import "./AdminItemModal.css";

export default function AdminItemModal({
  item,
  lowStockProducts = [],
  onClose,
}) {
  /*
  ============================================================
  LOW STOCK LIST MODAL
  ============================================================
  */

  if (lowStockProducts.length > 0) {
    return (
      <div className="admin-modal-overlay" onClick={onClose}>
        <div
          className="admin-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button className="admin-modal-close" onClick={onClose}>
            ×
          </button>

          <h2>Low Stock Products</h2>

          <p>
            {lowStockProducts.length} product
            {lowStockProducts.length !== 1 ? "s" : ""} currently have low stock.
          </p>

          <div className="admin-order-products">
            {lowStockProducts.map((product) => (
              <div className="admin-product-row" key={product.P_ID}>
                <div>
                  <strong>{product.P_Name}</strong>

                  <small>Product #{product.P_ID}</small>
                </div>

                <span className="low-stock-badge">
                  {product.P_Stock} in stock
                </span>

                <span>${Number(product.P_Price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /*
  ============================================================
  NORMAL ITEM MODAL
  ============================================================
  */

  if (!item) {
    return null;
  }

  const isOrder = item.type === "order";

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}>
          ×
        </button>

        {isOrder ? (
          /*
          ==================================================
          ORDER
          ==================================================
          */

          <>
            <h2>Order #{item.O_ID}</h2>

            <div className="admin-modal-section">
              <h3>Customer</h3>

              <p>
                <strong>Name:</strong> {item.customer?.name}
              </p>

              <p>
                <strong>Email:</strong> {item.customer?.email}
              </p>
            </div>

            <div className="admin-modal-section">
              <h3>Order Information</h3>

              <p>
                <strong>Date:</strong> {new Date(item.O_Date).toLocaleString()}
              </p>

              <p>
                <strong>Status:</strong> {item.O_Status}
              </p>

              <p>
                <strong>Total:</strong> ${Number(item.total).toFixed(2)}
              </p>
            </div>

            <div className="admin-modal-section">
              <h3>Products</h3>

              <div className="admin-order-products">
                {item.products?.map((product) => (
                  <div className="admin-product-row" key={product.id}>
                    <span>{product.name}</span>

                    <span>x{product.quantity}</span>

                    <span>${Number(product.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /*
          ==================================================
          PRODUCT
          ==================================================
          */

          <>
            <h2>{item.P_Name}</h2>

            <img
              src={item.P_Picture}
              alt={item.P_Name}
              className="admin-modal-product-image"
            />

            <div className="admin-modal-section">
              <p>
                <strong>Product ID:</strong> #{item.P_ID}
              </p>

              <p>
                <strong>Category:</strong> {item.Cat_Name}
              </p>

              <p>
                <strong>Price:</strong> ${Number(item.P_Price).toFixed(2)}
              </p>

              <p>
                <strong>Stock:</strong> {item.P_Stock}
              </p>

              <p>
                <strong>Description:</strong>
              </p>

              <p>{item.P_Description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
