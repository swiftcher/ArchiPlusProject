import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Auth from "../pages/auth";
import MyOrders from "../pages/myOrders";

import AuthProvider from "../context/AuthProvider";
import ProductProvider from "../context/ProductProvider";

import Categories from "../pages/categories";
import About from "../pages/about";
import Myprofile from "../features/profile/Myprofile";
import Checkout from "../features/cart/Checkout";
import Messenger from "../pages/Messenger";

import VerifyEmail from "../pages/verication";

import AdminRoute from "../components/AdminRoutes/AdminRoute";
import CustomerRoute from "../components/CustomerRoutes/CustomerRoute";

import AdminDashboard from "../pages/AdminDashboard";

import CustomerLayout from "../Layouts/CustomerLayout";
import AdminLayout from "../Layouts/AdminLayout";
import AdminProducts from "../pages/AdminProducts";
import AdminOrders from "../pages/Adminorders";
import AdminReports from "../pages/AdminReports";


export default function App() {

  return (
    <BrowserRouter>

      <AuthProvider>

        <ProductProvider>

          <Routes>


            {/* =========================
                CUSTOMER AREA
            ========================== */}

            <Route
              element={
                <CustomerRoute>
                  <CustomerLayout />
                </CustomerRoute>
              }
            >

              <Route path="/" element={<Home />} />

              <Route path="/home" element={<Home />} />

              <Route path="/myOrders" element={<MyOrders />} />

              <Route path="/cart" element={<Checkout />} />

              <Route path="/categories" element={<Categories />} />

              <Route path="/about" element={<About />} />

              <Route path="/myprofile" element={<Myprofile />} />

              <Route path="/messenger" element={<Messenger />} />


            </Route>



            {/* =========================
                ADMIN AREA
            ========================== */}

            {/* ADMIN AREA */}
           <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }
>
<Route
path="orders"
element={<AdminOrders/>}
/>
  <Route
    index
    element={<AdminDashboard />}
  />

  <Route
    path="products"
    element={<AdminProducts />}
  />



  <Route
    path="reports"
    element={<AdminReports/>}
  />

</Route>

            {/* =========================
                PUBLIC AREA
            ========================== */}

            <Route
              path="/auth"
              element={<Auth />}
            />

            <Route
              path="/verify-email"
              element={<VerifyEmail />}
            />


          </Routes>


        </ProductProvider>

      </AuthProvider>


    </BrowserRouter>
  );
}