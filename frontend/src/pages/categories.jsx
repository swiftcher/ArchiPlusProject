import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductFolder/ProductCard";
import "./categories.css";
import { useSearchParams } from "react-router-dom";




export default function Categories() {
  
  const { filteredProducts } = useContext(ProductContext);


  

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;


const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("cat") || "all";

const filtered = filteredProducts.filter((p) => {
  if (selectedCategory === "all") return true;

  return p.Cat_Name?.toLowerCase() === selectedCategory.toLowerCase();
});





  // filter logic
  

  // pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const categories = ["all", "3DPrinted", "Digital Art", "Material Art", "Fabrics","Canvas"];

  return (
    <div className="categories-page">

      {/* HEADER */}
      <h1 className="categories-title">All Products</h1>

      {/* FILTERS */}
      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => {
            setCurrentPage(1);
            setSearchParams(cat === "all" ? {} : { cat });
          }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="products-grid">
        {currentProducts.map((product) => (
          <ProductCard key={product.P_ID} {...product} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}