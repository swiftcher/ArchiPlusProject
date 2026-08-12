
import Cart from "../../components/cartFolder/cart";
import { useCartViewModel } from "../cart/cartViewModel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PayPalButton from "../../components/PaypalFolder/Paypalbutton";
import "./checkout.css";

export default function Checkout() {

    const [summaryOpen, setSummaryOpen] = useState(false);

    const [orderId, setOrderId] = useState(null);

    const [processingCheckout, setProcessingCheckout] =
        useState(false);

    const [paymentStarted, setPaymentStarted] =
        useState(false);

    const navigate = useNavigate();

    const {
        token,
        cart,
        loading,
        reloadCart,
        totalQuantity,
        handleCheckout
    } = useCartViewModel();


    // ============================================================
    // START PAYMENT
    // ============================================================

    const startPayment = async () => {

        try {

            setProcessingCheckout(true);

            console.log("Starting checkout...");

            // This creates our internal order
            // and reserves the stock.
            const O_ID = await handleCheckout();

            console.log(
                "Internal order created:",
                O_ID
            );

            setOrderId(O_ID);

            // Now show PayPal
            setPaymentStarted(true);

        } catch (error) {

            console.error(
                "Start payment error:",
                error
            );

            alert(
                error.response?.data?.error?.message ||
                "Could not start checkout."
            );

        } finally {

            setProcessingCheckout(false);
        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return <p>Loading...</p>;
    }


    // ============================================================
    // LOGIN CHECK
    // ============================================================

    if (!token) {

        return (
            <div className="cart-state">

                <h2>🔒 Access Denied</h2>

                <p>
                    Please login to view your cart
                </p>

                <button
                    onClick={() => navigate("/auth")}
                >
                    Go to Login
                </button>

            </div>
        );
    }


    // ============================================================
    // EMPTY CART
    // ============================================================

    if (cart.length === 0 && !paymentStarted) {

        return (
            <div className="cart-state empty">

                <h2>🛒 Your cart is empty</h2>

                <p>
                    Start shopping and add your first item
                </p>

                <button
                    onClick={() => navigate("/categories")}
                >
                    Start Shopping
                </button>

            </div>
        );
    }


    // ============================================================
    // TOTAL
    // ============================================================

    const itemTotal = (item) => {

        return (
            Number(item.P_Price) *
            Number(item.Quantity)
        );
    };


    const grandTotal = cart.reduce(
        (sum, item) => {

            return sum + itemTotal(item);

        },
        0
    );


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div className="checkout">

            <h1>Checkout</h1>


            {/* ==================================================
                CART
            ================================================== */}

            {!paymentStarted && (
                <Cart
                    items={cart}
                    itemTotal={itemTotal}
                    reloadCart={reloadCart}
                />
            )}


            {/* ==================================================
                ORDER SUMMARY
            ================================================== */}

            {!paymentStarted && (

                <div className="cart-summary">

                    <h3>
                        Order Summary
                    </h3>

                    <p>
                        Total: $
                        {grandTotal.toFixed(2)}
                    </p>


                    <button
                        className="checkout-btn"
                        onClick={startPayment}
                        disabled={processingCheckout}
                    >

                        {processingCheckout
                            ? "Preparing payment..."
                            : "Proceed to Payment"
                        }

                    </button>

                </div>

            )}


            {/* ==================================================
                MOBILE / COLLAPSED SUMMARY
            ================================================== */}

            {!paymentStarted && (

                <div className="summary-wrapper">

                    <button
                        className="summary-toggle"
                        onClick={() => {

                            setSummaryOpen(
                                prev => !prev
                            );

                            reloadCart();

                        }}
                        title="Toggle Summary"
                    >
                        🧾
                    </button>


                    <div
                        className={
                            `summary-panel ${
                                summaryOpen
                                    ? "open"
                                    : ""
                            }`
                        }
                    >

                        <h3>
                            Order Summary
                        </h3>


                        <div className="summary-row">

                            <span>
                                Items
                            </span>

                            <span>
                                {totalQuantity}
                            </span>

                        </div>


                        <div className="summary-row">

                            <span>
                                Total
                            </span>

                            <span>
                                ${grandTotal.toFixed(2)}
                            </span>

                        </div>


                        <div className="summary-row">

                            <span>
                                Shipping
                            </span>

                            <span>
                                Free
                            </span>

                        </div>


                        <div className="summary-total">

                            <span>
                                Final
                            </span>

                            <span>
                                ${grandTotal.toFixed(2)}
                            </span>

                        </div>


                        <button
                            onClick={startPayment}
                            disabled={processingCheckout}
                        >

                            {processingCheckout
                                ? "Preparing payment..."
                                : "Proceed to Payment"
                            }

                        </button>

                    </div>

                </div>

            )}


            {/* ==================================================
                PAYPAL
            ================================================== */}

            {paymentStarted && orderId && (

                <div className="paypal-section">

                    <h2>
                        Complete Your Payment
                    </h2>

                    <p>
                        Order #{orderId}
                    </p>

                    <p>
                        Your items have been reserved.
                    </p>

                    <p>
                        Please complete your payment
                        with PayPal.
                    </p>


                    <PayPalButton
                        O_ID={orderId}

                        onSuccess={(result) => {

                            console.log(
                                "Payment successful:",
                                result
                            );

                            alert(
                                "Payment completed successfully!"
                            );

                            navigate("/home");

                        }}
                    />

                </div>

            )}

        </div>
    );
}

