import QuantityCard from "../quantityAddFolder/quantityCard";
import "./carItem.css";

function CartItem({
    
    P_Name,
    P_Price,
    P_Picture,
    P_Stock,
    P_ID,
    Quantity,
    itemTotal,
    reloadCart
}) {
    return (
        <div className="cart-item">

            <img src={P_Picture} alt={P_Name} className="cart-img" />

            <div className="cart-info">

                <h4>{P_Name}</h4>

                <p>Unit Price: ${P_Price}</p>

                <p>Quantity: {Quantity}</p>
                <p>Stock: {P_Stock}</p>
                <QuantityCard stock={P_Stock} 
                P_ID={P_ID} 
                Quantity = {Quantity}
                reloadCart ={reloadCart}
                />

                <p className="item-total">
                    Total: ${itemTotal}
                </p>

              

            </div>

        </div>
    );
}

export default CartItem;