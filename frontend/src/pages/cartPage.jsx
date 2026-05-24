import { useEffect, useState, useContext } from "react";
import Cart from "../components/cartFolder/cart";
import { AuthContext } from "../context/AuthContext";

export default function Checkout() {
  const { auth } = useContext(AuthContext);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const loadCart = async () => {
    if (!auth?.token) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/cart", {
      headers: {
        Authorization: `Bearer ${auth?.token}`
      }
    });

    const data = await res.json();
    setCart(data.data || []);

    setLoading(false);
  };

  loadCart();
}, [auth]);

  const total = cart.reduce((sum, item) => {
    return sum + item.P_Price * item.Quantity;
  }, 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`
        }
      });

      const data = await res.json();
      console.log(data);

      setCart([]); // clear UI after checkout
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!auth) return <p>Please login to view your cart</p>;

  return (
    <div className="checkout">

      <h1>Checkout</h1>

      <Cart items={cart} />

      <h2>Total: ${total}</h2>

      <button className="checkout-btn" onClick={handleCheckout}>
        Place Order
      </button>

    </div>
  );
}