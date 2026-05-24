import ProductCarousel from "../components/CarouselFolder/Carousel";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import "./home.css";
import convo from "../assets/convo.jpg";


export default function Home() {
  const { products } = useContext(ProductContext);

  const homeProducts = [...products].sort((a, b) =>
    a.P_Name.localeCompare(b.P_Name)
  );

  // simple split for demo (you can replace later with real data)
  const featuredProducts = homeProducts.slice(0, 10);
  const newProducts = homeProducts.slice(10, 16);

  return (
    <div className="home">

      {/* HERO */}
      <section className="home-hero">
        <h1>Welcome to ArchiPlus</h1>
        <p>Where ideas, design, and creativity are shared</p>
        
         <img src={convo} alt="" />
      </section>

      {/* CATEGORIES PREVIEW */}
      <section className="home-categories">
        <div className="category-card">3D-Printed</div>
        <div className="category-card">Canvas</div>
        <div className="category-card">Fabrics</div>
        <div className="category-card">Digital Art</div>
        <div className="category-card">Material art</div>
      </section>

      {/* FEATURED */}
      <section className="home-section">
        <h2 className="home-title">Featured Products</h2>
        <ProductCarousel products={featuredProducts} />
      </section>

      {/* NEW ARRIVALS */}
      <section className="home-section">
        <h2 className="home-title">New Arrivals</h2>
        <ProductCarousel products={newProducts} />
      </section>

    </div>
  );
}