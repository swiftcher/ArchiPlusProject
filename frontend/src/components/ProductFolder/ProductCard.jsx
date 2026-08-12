import QuantityCard from "../quantityAddFolder/quantityCard";
import "./productCard.css";

function ProductCard({
    P_ID,
    P_Name,
    Cat_Name,
    P_Price,
    P_Description,
    P_Picture,
    AvailableStock,
    Quantity,
    averageRating = 0,
    onProductClick,
}) {

    // MySQL may return AVG() as a string
    const numericRating = Number(averageRating) || 0;

    const renderStars = (rating) => {
        const roundedRating = Math.round(rating);

        return (
            <span
                className="stars"
                aria-label={`${rating} out of 5 stars`}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={
                            star <= roundedRating
                                ? "star filled"
                                : "star"
                        }
                    >
                        ★
                    </span>
                ))}
            </span>
        );
    };

    const handleCardClick = () => {
        onProductClick?.({
            P_ID,
            P_Name,
            Cat_Name,
            P_Price,
            P_Description,
            P_Picture,
            AvailableStock,
            averageRating: numericRating,
        });
    };

    return (
        <div
            className="card"
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    handleCardClick();
                }
            }}
        >
            <img
                src={P_Picture}
                alt={P_Name}
                className="card-img"
            />

            <div className="card-rating">
                {renderStars(numericRating)}

                <span className="rating-number">
                    {numericRating > 0
                        ? numericRating.toFixed(1)
                        : "No ratings"}
                </span>
            </div>

            <div className="card-body">
                <h3>{P_Name}</h3>

                <p className="category">
                    {Cat_Name}
                </p>

                <p className="desc">
                    {P_Description}
                </p>

                <div className="info">
                    <span>
                        Price: ${Number(P_Price).toFixed(2)}
                    </span>

                    <span>
                        Stock: {AvailableStock}
                    </span>
                </div>

                <div
                    className="qty-wrapper"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <QuantityCard
                        stock={AvailableStock}
                        P_ID={P_ID}
                        Quantity={Quantity}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProductCard;