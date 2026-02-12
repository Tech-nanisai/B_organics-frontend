import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheck, FaArrowRight, FaHome } from "react-icons/fa";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentMethod = location.state?.method || "COD";

  // Simulate a random order ID for display
  const [orderId] = useState(`#ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Countdown timer (Visual)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    // Redirect timer (Functional) - 15 SECONDS
    const timer = setTimeout(() => {
      navigate("/");
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="OrderSuccess-wrapper">
      <div className="OrderSuccess-overlay"></div>

      {/* Confetti Particles (CSS Only Implementation) */}
      <div className="OrderSuccess-confetti">
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
      </div>

      <div className="OrderSuccess-card">
        <div className="OrderSuccess-status-icon">
          <div className="OrderSuccess-ripple"></div>
          <FaCheck className="OrderSuccess-check" />
        </div>

        <div className="OrderSuccess-content">
          <h2 className="OrderSuccess-title">
            {paymentMethod === "COD" ? "Order Placed Successfully!" : "Payment Successful!"}
          </h2>
          <p className="OrderSuccess-subtitle">
            {paymentMethod === "COD" ? "Your request has been registered in the archive." : "Your order has been confirmed."}
          </p>

          <div className="OrderSuccess-id-badge">
            <span>Transaction ID</span>
            <strong>{orderId}</strong>
          </div>

          <div className="OrderSuccess-timer-bar">
            <div className="OrderSuccess-progress"></div>
          </div>

          <p className="OrderSuccess-redirect-text">
            Redirecting to home in <strong>{countdown}s</strong>
          </p>

          <button className="OrderSuccess-btn" onClick={() => navigate("/")}>
            <FaHome /> Go Home Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
