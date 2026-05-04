
import ProductCard from "../ProductFolder/ProductCard";
import "./carousel.css";

function ProductCarousel({ products }) {
    return (
        <div className="carousel">
            {products.map((product) => (
                <ProductCard
                    key={product.P_ID}
                    {...product}
                />
            ))}
        </div>
    );
}

export default ProductCarousel;