import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Auth from "../pages/auth";
import MyOrders from "../pages/myOrders";
import CartPage from "../pages/cartPage";

import Header from "../components/HeaderFolder/Header";
import AuthProvider from "../context/AuthProvider";
import ProductProvider from "../context/ProductProvider";
import Footer from "../components/FooterFolder/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>

        
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/myOrders" element={<MyOrders />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer/>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}