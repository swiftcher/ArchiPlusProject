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

            if (!token) {

                setCart([]);
                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                const res = await apiPrivate.get("cart/userCart");

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

        return sum + Number(item.P_Price) * Number(item.Quantity);

    }, 0);


    // =========================
    // TOTAL QUANTITY
    // =========================

    const totalQuantity = cart.reduce((sum, item) => {

        return sum + Number(item.Quantity);

    }, 0);


    // =========================
    // CREATE OUR ORDER
    // =========================

    const handleCheckout = async () => {

        try {

            const res = await apiPrivate.post("/orders/checkout");

            console.log("Checkout response:", res.data);

            const O_ID = res.data?.data?.O_ID;

            if (!O_ID) {

                throw new Error("Order ID was not returned");

            }

            // The database order now exists
            // and its stock is reserved.

            setCart([]);

            return O_ID;

        } catch (err) {

            console.error("Checkout error:", err);

            throw err;

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