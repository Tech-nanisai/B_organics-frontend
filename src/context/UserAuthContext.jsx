//Frontend/src/context/UserAuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // optional: needed if you call a backend logout API

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize selectedAddress from localStorage if available
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem("selectedAddress");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist selectedAddress to localStorage whenever it changes
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    } else {
      localStorage.removeItem("selectedAddress");
    }
  }, [selectedAddress]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5678/api/users/current", {
        withCredentials: true,
      });
      if (res.data.profile) {
        setUserData({ ...res.data.profile, addresses: res.data.addresses || [] });
        setIsLoggedIn(true);

        // Set default address ONLY if no address is currently selected
        // This preserves the user's manual selection across refreshes
        if ((!selectedAddress) && res.data.addresses && res.data.addresses.length > 0) {
          setSelectedAddress(res.data.addresses[0]);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        setSelectedAddress(null);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Auth fetch error:", err);
      }
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt to fetch user data on every mount/refresh
    fetchUserData();
  }, []);

  const login = () => {
    // We don't set the cookie here anymore; the backend Set-Cookie header handles it.
    // We just trigger a fetch to synchronize the UI state with the new session.
    setIsLoggedIn(true);
    fetchUserData();
  };

  const logout = async () => {
    try {
      setLoading(true);
      // 1. Call backend to clear httpOnly cookie correctly
      await axios.post("http://localhost:5678/api/users/logout", {}, { withCredentials: true });

      // 2. Reset local state
      setIsLoggedIn(false);
      setUserData(null);
      setSelectedAddress(null); // Clear selected address
      localStorage.removeItem("selectedAddress"); // Clear from storage

      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Forced local cleanup
      setIsLoggedIn(false);
      setUserData(null);
      setSelectedAddress(null);
      localStorage.removeItem("selectedAddress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, loading, login, logout, fetchUserData, selectedAddress, setSelectedAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
