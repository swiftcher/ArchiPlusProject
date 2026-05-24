import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Auth from "../pages/auth";
import MyOrders from "../pages/myOrders";


import Header from "../components/HeaderFolder/Header";
import AuthProvider from "../context/AuthProvider";
import ProductProvider from "../context/ProductProvider";
import Footer from "../components/FooterFolder/Footer";
import Categories from "../pages/categories";
import About from "../pages/about";
import Myprofile from "../features/profile/Myprofile";
import Checkout from "../features/cart/Checkout"
import Messenger from "../pages/Messenger";

import VerifyEmail from "../pages/verication";



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
          <Route path="/cart" element={<Checkout />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/myprofile" element={<Myprofile />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/messenger" element={<Messenger />} />
        </Routes>
        <Footer/>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}