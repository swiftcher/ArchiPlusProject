import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import "./header.css";

import { AuthContext } from "../../context/AuthContext";

import { ProductContext } from "../../context/ProductContext";
import logo from "../../assets/logo.svg";

function Header() {

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { search, setSearch } = useContext(ProductContext);
  const navigate = useNavigate();

  const { token, user, logout } = useContext(AuthContext);


  const isLoggedIn = !!token && !!user;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate("/categories");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setShowProfileMenu(false);
  };

  const handleLogin = () => {
    navigate("/auth");
    setShowProfileMenu(false);
  };

  return (
    <header className="header">

      {/* LOGO */}
      <div className="logo">
        <Link to="/home">
          <img src={logo} alt="ArchiPlus logo" />
        </Link>
      </div>

      {/* NAV */}
      <nav className="nav">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/categories">Categories</Link>
      </nav>

      {/* SEARCH */}
      <div className="search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="header-right">

        {/* CART */}
        <div
          className="cart-icon"
          onClick={() => navigate("/cart")}
        >
          🛍️
        </div>

        {/* messages */}
        {isLoggedIn && (
          <div className="message-icon"
          onClick={() => navigate("/messenger")}>
            📩

          </div>
            
          )}

        {/* PROFILE */}
        <div className="profile-section">

          <div
            className="profile-icon"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            👤
          </div>

          {isLoggedIn && (
            <p className="user-greeting">
              Hello {user?.name}
            </p>
          )}

          {showProfileMenu && (
            <div className="profile-dropdown">

              {isLoggedIn && (
                <>
                  <Link to="/myprofile">My Profile</Link>
                  <Link to="/myOrders">My Orders</Link>
                </>
              )}

              {isLoggedIn ? (
                <span onClick={handleLogout}>Logout</span>
              ) : (
                <span onClick={handleLogin}>Login</span>
              )}

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Header;