import CartItem from "../cartItemFolder/CartItem";
import "./cart.css";
function Cart({ items, itemTotal,reloadCart }) {
    return (
        <div className="cart-list">
            {items.map(item => (
                <CartItem
                    key={item.Cart_ID}
                    {...item}
                    itemTotal={itemTotal(item)}
                    reloadCart = {reloadCart}
                />
            ))}
        </div>
    );
}

export default Cart;