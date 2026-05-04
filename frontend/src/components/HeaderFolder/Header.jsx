import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import "./header.css";

import { AuthContext } from "../../context/AuthContext";
import { ProductContext } from "../../context/ProductContext";

function Header() {
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { search, setSearch } = useContext(ProductContext);
  const navigate = useNavigate();

  const { auth, logout } = useContext(AuthContext);

  const isLoggedIn = !!auth?.token;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate("/home");
    

      
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
        <Link to="/home">ArchiPlus</Link>
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

      {/* PROFILE */}
      <div className="profile-section">

        <div
          className="profile-icon"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          👤
        </div>
        {isLoggedIn && (
          <div>
            <p> hello {auth?.U_Name}</p>
          </div>

        )}

        {showProfileMenu && (
          <div className="profile-dropdown">

          

            <Link to="/profile">My Profile</Link>
            <Link to="/myOrders">My Orders</Link>

          

            {/* AUTH CONTROL */}
            {isLoggedIn ? (
              <span className="logout" onClick={handleLogout}>
                Logout
              </span>
            ) : (
              <span onClick={handleLogin}>
                Login
              </span>
            )}

          </div>
        )}

      </div>

    </header>
  );
}

export default Header;