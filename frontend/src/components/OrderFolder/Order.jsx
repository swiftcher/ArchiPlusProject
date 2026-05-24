import { useState } from "react";
import "./order.css";
import Button from "../ButtonFolder/Button";

function Order({ O_ID, U_ID, O_Status, O_Date }) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="order-card">
            <div className="order-header">
                <h3>Order #{O_ID}</h3>
                <span className={`status ${O_Status.toLowerCase()}`}>
                    {O_Status}
                </span>
            </div>

            <div className="order-body">
                <p><strong>User ID:</strong> {U_ID}</p>
                <p><strong>Date:</strong> {new Date(O_Date).toLocaleDateString()}</p>
            </div>

            <div style={{ padding: "10px" }}>
                <Button
                    text="Check this Order "
                    onClick={() => setShowModal(true)}
                />
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                {/*// stoptPropagation: Prevent click from bubbling up to parent elements
                    //  (so clicking inside the modal doesn't trigger overlay close)*/}
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        
                        <h2>My Orders</h2>
                        <p>This is your popup window</p>

                        <button onClick={() => setShowModal(false)}>
                            Close
                        </button>

                    </div>
                </div>
)}        
        </div>
    );
}

export default Order;