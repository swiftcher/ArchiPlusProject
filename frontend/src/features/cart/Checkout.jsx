import Cart from "../../components/cartFolder/cart";
import { useCartViewModel } from "../cart/cartViewModel";
import { useNavigate } from "react-router-dom";
import "./checkout.css"

export default function Checkout() {
    const navigate = useNavigate();

    const {
        token,
        cart,
        loading,
        total,
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
    

    return (
        <div className="checkout">

            <h1>Checkout</h1>

            <Cart items={cart} />
            

            <h2>Total: ${total}</h2>

            <button
                className="checkout-btn"
                onClick={handleCheckout}
            >
                Place Order
            </button>

        </div>
    );
}