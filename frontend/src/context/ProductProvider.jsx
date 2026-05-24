import { useState, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import api from "../api/axios"; 


export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // fetch once
  useEffect(() => {
  api.get("/products")
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