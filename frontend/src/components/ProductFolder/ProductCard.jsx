
import "./productCard.css";
import QuantityCard from "../quantityAddFolder/quantityCard";

function ProductCard({
    P_ID,
    P_Name,
    Cat_Name,
    P_Price,
    P_Description,
    P_Picture,
    AvailableStock,
    Quantity
    
}) {
    

    

    

    return (
        <div className="card">
            <img src={P_Picture} alt={P_Name} className="card-img" />

            <div className="card-body">
                <h3>{P_Name}</h3>
                <p className="category">{Cat_Name}</p>
                <p className="desc">{P_Description}</p>

                <div className="info">
                    <span>Price: ${P_Price}</span>
                    <span>Stock: {AvailableStock}</span>
                </div>

                {/* QUANTITY CONTROLLER */}
                <QuantityCard
                    stock={AvailableStock}
                    P_ID={P_ID}
                    Quantity={Quantity}
                      
                    
                />
            </div>
        </div>
    );
}

export default ProductCard;