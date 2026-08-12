import { useState, useContext } from "react";
import Button from "../ButtonFolder/Button";
import "./quantityCards.css";
import apiPrivate from "../../api/apiPrivate";
import { NotificationContext } from "../../context/NotificationContext";

function QuantityAddToCart({ stock, P_ID, Quantity, reloadCart }) {

    const { showNotification } = useContext(NotificationContext);

    const [cartItem, setCartItem] = useState({
        P_ID: P_ID,
        Quantity: Quantity,
        increment: 1,
    });

    const increase = () => {

        if (stock <= 0) return;

        setCartItem((prev) => {

            if (prev.increment < stock) {
                return {
                    ...prev,
                    increment: prev.increment + 1
                };
            }

            return prev;
        });
    };

    const decrease = () => {

        if (stock <= 0) return;

        setCartItem((prev) => {

            if (prev.increment > 1) {
                return {
                    ...prev,
                    increment: prev.increment - 1
                };
            }

            return prev;
        });
    };

    const handleAdd = async () => {

        if (stock <= 0) {
            showNotification("Out of Stock", "error");
            return;
        }

        try {

            const res = await apiPrivate.post("/cart", cartItem);

            reloadCart?.();

            setCartItem((prev) => ({
                ...prev,
                Quantity: res.data?.Quantity ?? prev.Quantity,
                increment: 1,
            }));

            showNotification(
                "Product added to cart successfully",
                "success"
            );

        } catch (err) {

            if (err.response?.status === 400) {

                showNotification(
                    "Out of Stock",
                    "error"
                );

            } else if (err.response?.status === 401) {

                showNotification(
                    "Please sign in first",
                    "error"
                );

            } else {

                showNotification(
                    "Something went wrong while adding to cart",
                    "error"
                );
            }
        }
    };

    // =====================================================
    // OUT OF STOCK
    // =====================================================

    if (stock <= 0) {

        return (
            <div className="qty-wrapper out-of-stock">

                <span className="out-of-stock-text">
                    Out of Stock
                </span>

            </div>
        );
    }

    // =====================================================
    // NORMAL STOCK
    // =====================================================

    return (
        <div className="qty-wrapper">

            <div className="qty-control">

                <button
                    type="button"
                    onClick={decrease}
                    disabled={cartItem.increment <= 1}
                >
                    -
                </button>

                <span>
                    {cartItem.increment}
                </span>

                <button
                    type="button"
                    onClick={increase}
                    disabled={cartItem.increment >= stock}
                >
                    +
                </button>

            </div>

            <Button
                text="Add to Cart"
                onClick={handleAdd}
            />

        </div>
    );
}

export default QuantityAddToCart;