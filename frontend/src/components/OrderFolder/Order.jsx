import { useState } from "react";
import "./order.css";
import Button from "../ButtonFolder/Button";
import { useOrderViewModel } from "./OrderViewModel";

function Order({ O_ID, U_ID, O_Status, O_Date }) {
  const { loadOrderDetails, details } = useOrderViewModel();

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Order #{O_ID}</h3>
        <span className={`status ${O_Status.toLowerCase()}`}>{O_Status}</span>
      </div>

      <div className="order-body">
        <p>
          <strong>User ID:</strong> {U_ID}
        </p>
        <p>
          <strong>Date:</strong> {new Date(O_Date).toLocaleDateString()}
        </p>
      </div>

      <div style={{ padding: "10px" }}>
        <Button
          text="Check this Order"
          onClick={async () => {
            await loadOrderDetails(O_ID);
            setShowModal(true);
          }}
        />
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          {/*// stoptPropagation: Prevent click from bubbling up to parent elements
                    //  (so clicking inside the modal doesn't trigger overlay close)*/}
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {details && details.length > 0 ? (
              details.map((item, index) => (
                <div key={index}>
                  <p>Product: {item.P_Name}</p>
                  <p>Quantity: {item.Quantity}</p>
                  <p>Price: {item.UnitPrice}</p>
                  <p>Total: {item.TotalPrice}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}

            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
