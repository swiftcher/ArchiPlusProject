import ProductCard from "../ProductFolder/ProductCard";
import "./carousel.css";

function ProductCarousel({ products, cart }) {

    return (
        <div className="carousel">

            {products.map(product => {

                const existingCartItem = cart.find(
                    item => item.P_ID === product.P_ID
                );

                const currentQuantity =
                    existingCartItem?.Quantity || 0;

                return (
                    <ProductCard
                        key={product.P_ID}
                        {...product}
                        Quantity={currentQuantity}
                    />
                );
            })}

        </div>
    );
}

export default ProductCarousel;