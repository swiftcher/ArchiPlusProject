
import ProductCarousel from "../components/CarouselFolder/Carousel";

import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import "./home.css";

export default function Home() {
  const { filteredProducts } = useContext(ProductContext);

  const homeProducts = [...filteredProducts].sort((a, b) =>
    a.P_Name.localeCompare(b.P_Name)
  );

  return (
    <div className="home">

      <h2 className="home-title">Featured Products</h2>

      <ProductCarousel products={homeProducts} />

    </div>
  );
}