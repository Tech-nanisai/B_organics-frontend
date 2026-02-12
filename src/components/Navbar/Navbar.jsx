import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/UserAuthContext";
import UserProfileDropdown from "../UserProfileDropdown/UserProfileDropdown.jsx";
import AutoLocation from "../AutoLocation/autoLocation.jsx";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  // Remove unused searchTerm state since ‘query’ is used
  const { getCartCount } = useCart();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isSideProductsOpen, setSideProductsOpen] = useState(false);
  // Add fallback for useAuth in case strict mode or context is missing details
  const { isLoggedIn, logout, userData, loading } = useAuth() || { isLoggedIn: false, logout: () => { }, userData: null, loading: true };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // SearchBar logic
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchSuggestions = async (text) => {
    if (!text) return setSuggestions([]);
    setSearchLoading(true);
    try {
      const res = await fetch(`http://localhost:5678/api/search?query=${text}`);
      const data = await res.json();
      if (res.ok) {
        setSuggestions(data.slice(0, 10));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search-products?q=${query}`);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

  // Scroll Logic for Bottom Navbar
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Threshold to prevent jitter (shaking)
      if (Math.abs(delta) < 10) return;

      if (delta > 0 && currentScrollY > 100) {
        // Scrolling Down -> Hide
        setShowBottomNav(false);
      } else if (delta < 0) {
        // Scrolling Up -> Show
        setShowBottomNav(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="Navbar-desktop">
        <div className="Navbar-desktop-top">
          <Link to="/" className="Navbar-logo">
            <img
              src="https://res.cloudinary.com/drevfgyks/image/upload/v1713367084/B%20organics/Logo.jpeg_mermiy.jpg"
              alt="Borganics Logo"
              className="Navbar-logo-img"
            />
            <span className="Navbar-company-title">Borganics</span>
          </Link>

          <div className="Navbar-search-wrapper">
            <div className="Navbar-search">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search premium products..."
                className="Navbar-searchInput"
              />
              <button onClick={handleSearch} className="Navbar-searchButton">
                <FaSearch />
              </button>

              {query && suggestions.length > 0 && (
                <div className="Navbar-searchResults">
                  <ul className="Navbar-suggestions-list">
                    {suggestions.map((item) => (
                      <li
                        key={item._id}
                        onClick={() => {
                          navigate(`/search-products?q=${item.name}`);
                          setSuggestions([]);
                        }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="Navbar-icons">
            <UserProfileDropdown />
            <Link to="/cart" className="Navbar-icon">
              <i className="fa-solid fa-cart-shopping" title="Cart"></i>
              {getCartCount() > 0 && (
                <span className="Navbar-cart-badge">{getCartCount()}</span>
              )}
            </Link>
          </div>
        </div>

        <div className={`Navbar-desktop-bottom ${showBottomNav ? "" : "hidden"}`}>
          <AutoLocation />

          <ul className="Navbar-menu">
            <li className="Navbar-menuItem">
              <Link to="/">Home</Link>
            </li>
            <div
              className="Navbar-dropdownWrapper"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <li
                className={`Navbar-menuItem ${isProductsOpen ? "active" : ""
                  }`}
              >
                Products
                <ul
                  className={`Navbar-dropdown ${isProductsOpen ? "open" : ""
                    }`}
                >
                  <li className="Navbar-dropdownItem">
                    <Link to="/honey">Honey</Link>
                  </li>
                  <li className="Navbar-dropdownItem">
                    <Link to="/coffee">Coffee</Link>
                  </li>
                  <li className="Navbar-dropdownItem">
                    <Link to="/vegetables">Vegetables</Link>
                  </li>
                  <li className="Navbar-dropdownItem">
                    <Link to="/fruits">Fruits</Link>
                  </li>
                  <li className="Navbar-dropdownItem">
                    <Link to="/all-products">All Products</Link>
                  </li>
                </ul>
              </li>
            </div>
            <li className="Navbar-menuItem">
              <Link to="/contact">Contact</Link>
            </li>
            <li className="Navbar-menuItem">
              <Link to="/aboutus">About us</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav className="Navbar-mobile">
        <div className="Navbar-mobile-top">
          <Link to="/" className="Navbar-mobile-logo">
            <i className="fa-solid fa-leaf"></i>
            <span>Borganics</span>
          </Link>
          <div className="Navbar-mobile-icons">
            <UserProfileDropdown />
            <Link to="/cart" className="Navbar-icon" style={{ fontSize: "1.2rem" }}>
              <i className="fa-solid fa-cart-shopping" title="Cart"></i>
              {getCartCount() > 0 && (
                <span className="Navbar-cart-badge">{getCartCount()}</span>
              )}
            </Link>
            <i
              className={`fa-solid ${isSidebarOpen ? "fa-xmark" : "fa-bars"}`}
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            ></i>
          </div>
        </div>
        <div className="Navbar-mobile-bottom">
          <input
            type="text"
            placeholder="Search..."
            className="Navbar-mobile-searchInput"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className="Navbar-mobile-searchButton" onClick={handleSearch}>
            Go
          </button>

          {isSidebarOpen && query && suggestions.length > 0 && (
            <div className="Navbar-mobile-suggestions">
              <ul className="Navbar-suggestions-list">
                {suggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => {
                      navigate(`/search-products?q=${item.name}`);
                      setSuggestions([]);
                      setSidebarOpen(false);
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className={`Navbar-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div style={{ flex: 1 }}>
          <div className="Navbar-sidebar-location">
            <AutoLocation />
          </div>
          <ul className="Navbar-sidebar-menu">
            <li className="Navbar-sidebar-menuItem">
              <Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
            </li>
            {isLoggedIn && (
              <li className="Navbar-sidebar-menuItem">
                <Link to="/orders" onClick={() => setSidebarOpen(false)}>My Orders</Link>
              </li>
            )}
            <li className="Navbar-sidebar-menuItem">
              <div
                className="Navbar-sidebar-products-header"
                onClick={() => setSideProductsOpen(!isSideProductsOpen)}
              >
                Products
                <i
                  className={`fa-solid ${isSideProductsOpen ? "fa-chevron-up" : "fa-chevron-down"
                    }`}
                ></i>
              </div>
              <ul
                className={`Navbar-sidebar-dropdown ${isSideProductsOpen ? "open" : ""
                  }`}
              >
                <li className="Navbar-sidebar-dropdownItem">
                  <Link to="/honey" onClick={() => setSidebarOpen(false)}>Honey</Link>
                </li>
                <li className="Navbar-sidebar-dropdownItem">
                  <Link to="/coffee" onClick={() => setSidebarOpen(false)}>Coffee</Link>
                </li>
                <li className="Navbar-sidebar-dropdownItem">
                  <Link to="/vegetables" onClick={() => setSidebarOpen(false)}>Vegetables</Link>
                </li>
                <li className="Navbar-sidebar-dropdownItem">
                  <Link to="/fruits" onClick={() => setSidebarOpen(false)}>Fruits</Link>
                </li>
                <li className="Navbar-sidebar-dropdownItem">
                  <Link to="/all-products" onClick={() => setSidebarOpen(false)}>All Products</Link>
                </li>
              </ul>
            </li>
            <li className="Navbar-sidebar-menuItem">
              <Link to="/contact" onClick={() => setSidebarOpen(false)}>Contact</Link>
            </li>
            <li className="Navbar-sidebar-menuItem">
              <Link to="/aboutus" onClick={() => setSidebarOpen(false)}>About us</Link>
            </li>
          </ul>
        </div>

        <div className="Navbar-sidebar-bottom">
          <div
            className="Navbar-sidebar-auth"
            onClick={() => {
              isLoggedIn ? handleLogout() : navigate("/login");
              setSidebarOpen(false);
            }}
          >
            {isLoggedIn && userData?.profileImage ? (
              <img
                src={`data:image/jpeg;base64,${userData.profileImage}`}
                alt="Profile"
                className="Navbar-sidebar-avatar"
              />
            ) : (
              <i className="fa-regular fa-user"></i>
            )}
            <span>{isLoggedIn ? (userData?.fullName || "Logout") : "Login"}</span>
          </div>
          <i
            className={`fa-regular ${isDark ? "fa-sun" : "fa-moon"
              }`}
            style={{ fontSize: "1.2rem", cursor: "pointer", color: "var(--Navbar-text)" }}
            onClick={() => setIsDark(!isDark)}
          ></i>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="Navbar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
