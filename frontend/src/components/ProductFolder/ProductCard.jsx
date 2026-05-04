
import "./productCard.css";
import QuantityCard from "../quantityAddFolder/quantityCard";

function ProductCard({
    P_ID,
    P_Name,
    Cat_Name,
    P_Price,
    P_Description,
    P_Picture,
    P_Stock,
    
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
                    <span>Stock: {P_Stock}</span>
                </div>

                {/* QUANTITY CONTROLLER */}
                <QuantityCard
                    stock={P_Stock}
                    P_ID={P_ID}
                      
                    
                />
            </div>
        </div>
    );
}

export default ProductCard;