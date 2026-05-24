import QuantityCard from "../quantityAddFolder/quantityCard";
import "./carItem.css";

function CartItem({
    P_ID,
    P_Name,
    P_Price,
    P_Picture,
    P_Stock
}) {
    return (
        <div className="cart-item">

            <img src={P_Picture} alt={P_Name} className="cart-img" />

            <div className="cart-info">
                <h4>{P_Name}</h4>
                <p>Price: ${P_Price}</p>
                <p>Stock: {P_Stock}</p>
            </div>

            {/* QUANTITY CONTROL */}
            <QuantityCard
                stock={P_Stock}
                P_ID={P_ID}
                
            />

        </div>
    );
}

export default CartItem;