import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import Login from "./pages/Login";
import FilterData from "./pages/FilterData";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";
import Aboutt from "./pages/Aboutt";
import AdminPanel from "./pages/AdminPanel";
import { getToken, authAPI } from "./services/api";


function App() {
  const [order, setOrder] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = getToken();
    if (token) {
      // Verify token by getting current user
      authAPI.getCurrentUser()
        .then(() => setIsLoggedIn(true))
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <MainApp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} order={order} setOrder={setOrder} />
    </BrowserRouter>
  );
}

// The MainApp component that contains the routing and conditional rendering
function MainApp({ isLoggedIn, setIsLoggedIn, order, setOrder }) {
  const location = useLocation(); // This is where you can safely use useLocation
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Only render Navbar and Footer if it's not the login or register page */}
      {!isLoginPage && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout setOrder={setOrder} />} />
        <Route path="/order-confirmation" element={<Order order={order} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/register" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={false} />} />
        <Route path="/filter-data" element={<FilterData />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<Aboutt />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      {/* Only render Footer if it's not the login or register page */}
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
