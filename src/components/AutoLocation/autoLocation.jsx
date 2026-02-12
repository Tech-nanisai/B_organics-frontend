import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaSyncAlt } from "react-icons/fa";
import { useAuth } from "../../context/UserAuthContext";
import "./autoLocation.css";

function AutoLocation() {
  const { isLoggedIn, selectedAddress } = useAuth() || {};
  const [location, setLocation] = useState({ city: "", pincode: "", error: "", loading: true });

  const fetchLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: "" }));

    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "Geolocation not supported.", loading: false }));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Using OSM Nominatim with a specific language and zoom level for better precision
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();

          if (data && data.address) {
            const address = data.address;

            // Priority: suburb/neighborhood, then city/town
            const cityName = address.suburb || address.neighbourhood || address.city || address.town || address.village || "Hyderabad";

            // Extract postcode with a safe fallback
            const postcode = address.postcode || "500033";

            setLocation({
              city: cityName,
              pincode: postcode,
              error: "",
              loading: false
            });
          } else {
            throw new Error("Invalid address data");
          }
        } catch (err) {
          console.error("Address fetch error:", err);
          setLocation((prev) => ({ ...prev, error: "Failed to fetch address.", loading: false }));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "Location access denied.";
        if (error.code === error.TIMEOUT) msg = "Location request timed out.";
        setLocation((prev) => ({ ...prev, error: msg, loading: false }));
      },
      options
    );
  };

  useEffect(() => {
    // 1. If logged in and a specific address is SELECTED, use that
    if (isLoggedIn && selectedAddress) {
      setLocation({
        city: selectedAddress.city || "Unknown City",
        pincode: selectedAddress.zip || selectedAddress.pincode || "",
        error: "",
        loading: false
      });
    } else {
      // 2. Otherwise fallback to auto-detection (browser geolocation)
      fetchLocation();
    }
  }, [isLoggedIn, selectedAddress]);

  return (
    <div className={`AutoLocation-container ${location.loading ? 'is-loading' : ''}`}>
      <div className="AutoLocation-badge">
        <FaMapMarkerAlt className="AutoLocation-icon" />
        <div className="AutoLocation-content">
          {location.loading ? (
            <span className="AutoLocation-status">Locating...</span>
          ) : location.error ? (
            <span className="AutoLocation-error" onClick={fetchLocation}>
              {location.error} <FaSyncAlt className="AutoLocation-retry" />
            </span>
          ) : (
            <div className="AutoLocation-info">
              <span className="AutoLocation-label">Deliver to</span>
              <span className="AutoLocation-address">
                <strong>{location.city}</strong>, {location.pincode}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AutoLocation;
