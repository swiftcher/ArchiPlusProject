import Cart from "../../components/cartFolder/cart";
import { useCartViewModel } from "../cart/cartViewModel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./checkout.css"

export default function Checkout() {
    const [summaryOpen, setSummaryOpen] = useState(false);
    const navigate = useNavigate();

    const {
        token,
        cart,
        loading,
        reloadCart,
        totalQuantity,
        
        handleCheckout
    } = useCartViewModel();

    if (loading) {
        return <p>Loading...</p>;
    }

   if (!token) {
    return (
        <div className="cart-state">
            <h2>🔒 Access Denied</h2>
            <p>Please login to view your cart</p>
            <button onClick={() => navigate("/auth")}>
                Go to Login
            </button>
        </div>
    );
}

if (cart.length === 0) {
    return (
        <div className="cart-state empty">
            <h2>🛒 Your cart is empty</h2>
            <p>Start shopping and add your first item</p>
            <button onClick={() => navigate("/categories")}>
                Start Shopping
            </button>
        </div>
    );
}
const itemTotal = (item) => {
    return Number(item.P_Price) * Number(item.Quantity);
};

const grandTotal = cart.reduce((sum, item) => {
    return sum + itemTotal(item);
}, 0);

    

    return (
        <div className="checkout">

            <h1>Checkout</h1>

            <Cart items={cart} itemTotal={itemTotal} reloadCart={reloadCart} />
            <div className="cart-summary">

            <h3>Order Summary</h3>

            <p>Total: ${grandTotal.toFixed(2)}</p>
            

            <button
                className="checkout-btn"
                onClick={handleCheckout}
            >
                Checkout
            </button>

            </div>
<div className="summary-wrapper">

   <button
    className="summary-toggle"
    onClick={() => {
        setSummaryOpen(prev => !prev);
        reloadCart();
    }}
    title="Toggle Summary"
>
    🧾
</button>
    {/* panel */}
    <div className={`summary-panel ${summaryOpen ? "open" : ""}`}>

        <h3>Order Summary</h3>

        <div className="summary-row">
            <span>Items</span>
            <span>{totalQuantity}</span>
        </div>

        <div className="summary-row">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
        </div>

        <div className="summary-total">
            <span>Final</span>
            <span>${grandTotal.toFixed(2)}</span>
        </div>

        <button onClick={handleCheckout}>
            Checkout
        </button>

    </div>
</div>

        

        </div>

        
    );
}