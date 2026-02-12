import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import "./PlaceOrder.css";
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaShoppingBag, FaArrowRight, FaCheck, FaShieldAlt } from "react-icons/fa";

const PlaceOrder = () => {
  const { cartItems, clearCart } = useCart();
  const { userData, selectedAddress, setSelectedAddress } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    houseNo: "",
    village: "",
    district: "",
    pincode: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  // Sync with selectedAddress from Context
  useEffect(() => {
    if (selectedAddress) {
      setAddress({
        houseNo: selectedAddress.house || "",
        village: selectedAddress.street || "",
        district: selectedAddress.city || "",
        pincode: selectedAddress.zip || "",
        state: selectedAddress.state || "",
      });
    }
  }, [selectedAddress]);

  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  const getTotalPrice = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      const discounted = calculateDiscountedPrice(item.price, item.discount || 0);
      return total + discounted * item.Qty;
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setIsErrorModalOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!userData) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!address.houseNo || !address.village || !address.district || !address.pincode || !address.state) {
      showError("Please provide your complete shipping address to ensure safe delivery.");
      return;
    }

    if (paymentMethod !== "COD") {
      showError("Online payments are currently undergoing maintenance. Please select 'Cash on Delivery' to proceed.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user: {
          id: userData._id || userData.id,
          nanoid: userData.nanoid,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone
        },
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: calculateDiscountedPrice(item.price, item.discount || 0),
          qty: item.Qty,
          image: item.image
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: address,
        paymentMethod: "COD"
      };

      const response = await axios.post('https://b-organics-backend.onrender.com/api/orders/create', orderData, { withCredentials: true });

      if (response.status === 201) {
        clearCart();
        navigate("/order-success", { state: { method: paymentMethod } });
      }
    } catch (error) {
      console.error("Order error:", error);
      const serverMsg = error.response?.data?.message || "We encountered a temporary connection issue. Please try again in a moment.";
      showError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PlaceOrder-wrapper">
      {/* Premium Error Modal */}
      {isErrorModalOpen && (
        <div className="PlaceOrder-errorModal-overlay">
          <div className="PlaceOrder-errorModal-card">
            <div className="PlaceOrder-errorModal-icon">
              <FaShieldAlt />
            </div>
            <h3 className="PlaceOrder-errorModal-title">Information Required</h3>
            <p className="PlaceOrder-errorModal-message">{errorMessage}</p>
            <button className="PlaceOrder-errorModal-btn" onClick={() => setIsErrorModalOpen(false)}>
              Got it, let's fix it
            </button>
          </div>
        </div>
      )}
      <header data-aos="fade-down">
        <h2 className="PlaceOrder-title">Final Selection <br /> Checkout</h2>
      </header>

      <div className="PlaceOrder-layout">
        {/* Left Column: Forms */}
        <div className="PlaceOrder-forms">
          {/* Address Section */}
          <div className="PlaceOrder-section" data-aos="fade-right">
            <div className="PlaceOrder-sectionHeader">
              <h3><FaMapMarkerAlt /> Delivery Parameters</h3>
            </div>

            {/* Active Parameter Block (Always shown if selected) */}
            {selectedAddress && (
              <div className="PlaceOrder-activeAddressBlock" data-aos="zoom-in">
                <div className="PlaceOrder-activeHeader">
                  <span className="PlaceOrder-activeBadge"><FaCheck /> PRIMARY LOGISTICS PARAMETER</span>
                  <button className="PlaceOrder-changeBtn" onClick={() => setShowSavedAddresses(!showSavedAddresses)}>
                    {showSavedAddresses ? "CLOSE ARCHIVE" : "CHANGE ARCHIVE"}
                  </button>
                </div>
                <div className="PlaceOrder-activeContent">
                  <strong>{(selectedAddress.label || "ADDRESS").toUpperCase()} // READY</strong>
                  <p>{selectedAddress.house}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}</p>
                </div>
              </div>
            )}

            {showSavedAddresses && userData?.addresses && userData.addresses.length > 0 ? (
              <div className="PlaceOrder-savedAddresses">
                <h4 className="PlaceOrder-archiveTitle">SELECT FROM CLOUD ARCHIVE</h4>
                {userData.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className={`PlaceOrder-addressCard ${selectedAddress?.label === addr.label ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowSavedAddresses(false);
                    }}
                  >
                    <div className="PlaceOrder-addressCardHeader">
                      <strong>LOC: {(addr.label || "UNNAMED").toUpperCase()}</strong>
                      {selectedAddress?.label === addr.label && <span className="PlaceOrder-badge">ACTIVE</span>}
                    </div>
                    <p>{addr.house}, {addr.street}</p>
                    <p>{addr.city}, {addr.state} - {addr.zip}</p>
                    {selectedAddress?.label !== addr.label && <div className="PlaceOrder-cardOverlay">SELECT PROTOCOL</div>}
                  </div>
                ))}
              </div>
            ) : (
              !selectedAddress && (
                <div className="PlaceOrder-formGrid">
                  <input
                    type="text"
                    name="houseNo"
                    className="PlaceOrder-input"
                    placeholder="HOUSE / FLAT / BUILDING"
                    value={address.houseNo}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="village"
                    className="PlaceOrder-input"
                    placeholder="STREET / COLONY"
                    value={address.village}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="district"
                    className="PlaceOrder-input"
                    placeholder="CITY / DISTRICT"
                    value={address.district}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="state"
                    className="PlaceOrder-input"
                    placeholder="STATE"
                    value={address.state}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="pincode"
                    className="PlaceOrder-input"
                    placeholder="POSTAL PINCODE"
                    maxLength="6"
                    value={address.pincode}
                    onChange={handleInputChange}
                  />
                </div>
              )
            )}

            {!selectedAddress && userData?.addresses?.length > 0 && !showSavedAddresses && (
              <button className="PlaceOrder-fullBookBtn" onClick={() => setShowSavedAddresses(true)}>
                ACCESS CLOUD ADDRESS BOOK // {userData?.addresses?.length || 0} RECORDS
              </button>
            )}
          </div>

          {/* Payment Section */}
          <div className="PlaceOrder-section" data-aos="fade-right" data-aos-delay="200">
            <div className="PlaceOrder-sectionHeader">
              <h3><FaCreditCard /> Payment Protocols</h3>
            </div>
            <div className="PlaceOrder-paymentOptions">
              <label className={`PlaceOrder-paymentOption ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  className="PlaceOrder-radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span className="PlaceOrder-paymentLabel"><FaMoneyBillWave /> CASH ON DELIVERY (ACTIVE)</span>
              </label>

              <label className={`PlaceOrder-paymentOption ${paymentMethod === 'UPI' ? 'selected' : ''}`} style={{ opacity: 0.5 }}>
                <input
                  type="radio"
                  className="PlaceOrder-radio"
                  value="UPI"
                  disabled
                />
                <span className="PlaceOrder-paymentLabel"><FaMobileAlt /> UPI (SECURE CONNECTING...)</span>
              </label>

              <label className={`PlaceOrder-paymentOption ${paymentMethod === 'Card' ? 'selected' : ''}`} style={{ opacity: 0.5 }}>
                <input
                  type="radio"
                  className="PlaceOrder-radio"
                  value="Card"
                  disabled
                />
                <span className="PlaceOrder-paymentLabel"><FaCreditCard /> CREDIT ARCADE (LOCKED)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="PlaceOrder-summary" data-aos="fade-left">
          <h3><FaShoppingBag /> Summary Archive</h3>
          <ul className="PlaceOrder-itemList">
            {cartItems && cartItems.length > 0 ? cartItems.map((item) => {
              const discountedPrice = calculateDiscountedPrice(item.price, item.discount || 0);
              return (
                <li key={item._id} className="PlaceOrder-item">
                  <span className="PlaceOrder-itemName">
                    {item.name} <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#999' }}>[QTY: {item.Qty}]</span>
                  </span>
                  <span className="PlaceOrder-itemPrice">₹{discountedPrice * item.Qty}</span>
                </li>
              );
            }) : (
              <li className="PlaceOrder-item">No items in cart</li>
            )}
          </ul>

          <div className="PlaceOrder-totalSection">
            <span className="PlaceOrder-totalLabel">TOTAL ARCHIVE VALUE</span>
            <span className="PlaceOrder-totalPrice">₹{getTotalPrice()}</span>
          </div>

          <button
            id="btn-place-order-confirm"
            className="PlaceOrder-btn"
            onClick={handlePlaceOrder}
            disabled={loading || !cartItems || cartItems.length === 0}
          >
            {loading ? "SYNCHRONIZING..." : (<>CONFIRM ORDER <FaArrowRight /></>)}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center', fontFamily: 'Space Mono', fontSize: '0.6rem', color: '#ccc', letterSpacing: '1px' }}>
            ENCRYPTED TRANSACTION // 256-BIT SSL SECURED
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
