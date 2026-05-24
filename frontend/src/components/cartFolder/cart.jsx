import CartItem from "../cartItemFolder/CartItem";
import "./cart.css";

function Cart({items}) {

    

    return (
        <div className="cart-page">

            <h2>Your Cart</h2>

            <div className="cart-list">
                {items.map((item) => (
                    <CartItem
                        key={item.P_ID}
                        {...item}
                    />
                ))}
            </div>

        </div>
    );
}

export default Cart;