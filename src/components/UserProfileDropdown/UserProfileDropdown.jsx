//frontend/src/components/UserProfileDropdown/UserProfileDropdown.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserAuthContext"; // Adjust path as needed
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import "./UserProfileDropdown.css";

const UserProfileDropdown = () => {
  // Graceful fallback for auth context
  const { isLoggedIn, logout, userData, loading } = useAuth() || { isLoggedIn: false, logout: () => { }, userData: null, loading: false };
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const getProfileName = () => {
    if (userData?.fullName) return userData.fullName.split(' ')[0];
    return "Login";
  };

  if (loading) return <div className="UserProfile-loading-skeleton"></div>;

  return (
    <div
      className="UserProfile-container"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="UserProfile-trigger" onClick={toggleDropdown}>
        {isLoggedIn && userData?.profileImage ? (
          <img
            src={`data:image/jpeg;base64,${userData.profileImage}`}
            alt="Profile"
            className="UserProfile-avatarImg"
          />
        ) : (
          <FaUserCircle className="UserProfile-icon" />
        )}
        <span className="UserProfile-name">{getProfileName()}</span>
        <FaChevronDown
          className="UserProfile-chevron"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div className="UserProfile-menu">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="UserProfile-menuItem" onClick={() => setIsOpen(false)}>
                <i className="fa-regular fa-user"></i>
                <span>My Profile</span>
              </Link>
              <Link to="/orders" className="UserProfile-menuItem" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-box"></i>
                <span>Orders</span>
              </Link>
              <Link to="/settings" className="UserProfile-menuItem" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-gear"></i>
                <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className="UserProfile-menuItem logout">
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="UserProfile-menuItem login" onClick={() => setIsOpen(false)}>
                <i className="fa-regular fa-user"></i>
                <span>Customer Login</span>
              </Link>
              <Link to="/admin/login" className="UserProfile-menuItem login" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-user-shield"></i>
                <span>Admin Login</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
