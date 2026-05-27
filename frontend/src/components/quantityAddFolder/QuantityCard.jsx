import { useState } from "react";
import Button from "../ButtonFolder/Button";
import "./quantityCards.css";
import apiPrivate from "../../api/apiPrivate";


function QuantityAddToCart({ stock , P_ID,Quantity,reloadCart  }) {

    const [cartItem, setCartItem] = useState({
        P_ID: P_ID,
        Quantity: Quantity,
        increment:1
        
    });
    
  
    

    const increase = () => {
        setCartItem(prev => {
            

            if (prev.increment < stock) {
                return { ...prev, increment: prev.increment+ 1 };
            }
            return prev;
        });
    };

    const decrease = () => {
        setCartItem(prev => {
            if (prev.increment > 1) {
                return { ...prev, increment: prev.increment - 1 };
            }
            return prev;
        });
    };

    // ✅ THIS is your "handleSubmit style"
   const handleAdd = async () => {
  try {
    const res = await apiPrivate.post("/cart", cartItem);

    reloadCart?.();
    setCartItem(prev => ({
    ...prev,
    Quantity: res.Quantity,
    increment:1
    })); 
    
    

    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
    return (
        <div className="qty-wrapper">

            <div className="qty-control">
                <button onClick={decrease}>-</button>
                <span>{cartItem.increment}</span>
                <button onClick={increase}>+</button>
            </div>

            <Button text="Add to Cart" onClick={handleAdd} />

        </div>
    );
}

export default QuantityAddToCart;