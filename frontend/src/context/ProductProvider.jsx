import { useState, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import apiPublic from "../api/apiPublic"; 


export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // fetch once
  useEffect(() => {
  apiPublic.get("/products")
    .then(res => {
      setProducts(res.data.data || []);
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      setProducts([]);
    });
}, []);

  const filteredProducts = products.filter(p =>
    p.P_Name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProductContext.Provider value={{
      products,
      search,
      setSearch,
      filteredProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
}