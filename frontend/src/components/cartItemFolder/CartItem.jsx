import QuantityCard from "../quantityAddFolder/quantityCard";
import "./carItem.css";


import apiPrivate from "../../api/apiPrivate";
function CartItem({
    
    P_Name,
    P_Price,
    P_Picture,
    AvailableStock,
    P_ID,
    Quantity,
    itemTotal,
    reloadCart
}) 
{

  


    // THIS is your "handleSubmit style"
   const handleDecrease = async () => {
  try {
    const res = await apiPrivate.patch(`/cart/decrease/${P_ID}`);

    reloadCart?.();
    
    
    

    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

   const handleDelete = async () => {
  try {
    const res = await apiPrivate.delete(`/cart/${P_ID}`);

    reloadCart?.();
    
    
    

    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
    return (
        <div className="cart-item">

            <img src={P_Picture} alt={P_Name} className="cart-img" />

            <div className="cart-info">

                <h4>{P_Name}</h4>

                <p>Unit Price: ${P_Price}</p>

                <p>Quantity: {Quantity}</p>
                <p>Stock: {AvailableStock}</p>

        
            <div className="del-control">
                <button className="del-btn" onClick={handleDelete}>❌</button>
            </div>
        

         <div className="dec-wrapper">
            <div className="dec-control">
                <button className="dec-btn" onClick={handleDecrease}>Remove one item -</button>
            </div>
        </div>
                <QuantityCard stock={AvailableStock} 
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