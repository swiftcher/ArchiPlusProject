import { useState } from "react";
import Button from "../ButtonFolder/Button";
import "./quantityCards.css";

function QuantityAddToCart({ stock = 1, P_ID }) {

    const [cartItem, setCartItem] = useState({
        P_ID: P_ID,
        Quantity: 1
    });
    

    const increase = () => {
        if (cartItem.Quantity < stock) {
            setCartItem({
                ...cartItem,
                Quantity: cartItem.Quantity + 1
            });
        }
    };

    const decrease = () => {
        if (cartItem.Quantity > 1) {
            setCartItem({
                ...cartItem,
                Quantity: cartItem.Quantity - 1
            });
        }
    };

    // ✅ THIS is your "handleSubmit style"
    const handleAdd = async () => {

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(cartItem)
        });

        const data = await res.json();
        console.log(data);
    };

    return (
        <div className="qty-wrapper">

            <div className="qty-control">
                <button onClick={decrease}>-</button>

                <span>{cartItem.Quantity}</span>

                <button onClick={increase}>+</button>
            </div>

            <Button text="Add to Cart" onClick={handleAdd} />

        </div>
    );
}

export default QuantityAddToCart;