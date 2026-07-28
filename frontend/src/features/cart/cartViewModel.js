import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import apiPrivate from "../../api/apiPrivate";

export function useCartViewModel() {

    const { token } = useContext(AuthContext);

    const [cart, setCart] = useState([]);
    
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD CART
    // =========================
    const reloadCart = async () => {
    try {
        const res = await apiPrivate.get("cart/userCart");
        setCart(res.data?.data || []);
    } catch (err) {
        console.error(err);
    }
};
    useEffect(() => {

        const loadCart = async () => {
            console.log(token);
            

            if (!token) {
                setCart([]);
                setLoading(false);
                return;
            }

            try {
                

                setLoading(true);

                const res = await apiPrivate.get("cart/userCart");
                console.log(res.data);
                

                setCart(res.data?.data || []);

            } catch (err) {

                console.error("Cart load error:", err);

            } finally {

                setLoading(false);

            }
        };

        loadCart();

    }, [token]);

    // =========================
    // TOTAL
    // =========================
    const total = cart.reduce((sum, item) => {
        return sum + item.P_Price * item.Quantity;
    }, 0);
    // =========================
    // TOTAL quantity of all items selcted 
    // =========================
    const totalQuantity = cart.reduce((sum, item) => {
    return sum + Number(item.Quantity);
    }, 0);

    // =========================
    // CHECKOUT
    // =========================
    const handleCheckout = async () => {

        try {

            const res = await apiPrivate.post("/orders/checkout");

            console.log(res.data);

            // clear cart UI
            setCart([]);

            alert("Order placed successfully!");

        } catch (err) {

            console.error("Checkout error:", err);

        }
    };

    return {
        token,
        cart,
        loading,
        total,
        handleCheckout,
        reloadCart,
        totalQuantity 
    };
}