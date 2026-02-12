import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import "./PaymentGateway.css";

const PaymentGateway = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = searchParams.get("amount") || "0";
  const method = searchParams.get("method") || "Unknown";

  const [step, setStep] = useState(0);

  const steps = [
    "Establishing secure connection...",
    "Encrypting payment details...",
    `Contacting ${method === 'UPI' ? 'UPI Server' : 'Bank Gateway'}...`,
    "Verifying transaction...",
    "Payment Approved!"
  ];

  useEffect(() => {
    // Simulate process steps
    const stepInterval = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1500);

    // Final redirect
    const redirectTimer = setTimeout(() => {
      navigate("/order-success");
    }, 1500 * steps.length + 1000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate, steps.length]);

  return (
    <div className="PaymentGateway-container">
      <div className="PaymentGateway-card">
        <div className="PaymentGateway-iconWrapper">
          <div className="PaymentGateway-loader"></div>
          <FaLock className="PaymentGateway-lockIcon" />
        </div>

        <h2 className="PaymentGateway-title">Processing Payment</h2>
        <p className="PaymentGateway-message">
          Please do not refresh the page or hit back button.
          <br />
          <span style={{ fontWeight: '600', color: 'var(--PaymentGateway-primary)' }}>
            Processing ₹{amount} via {method}
          </span>
        </p>

        <div className="PaymentGateway-steps">
          {steps.map((text, index) => (
            <div
              key={index}
              className={`PaymentGateway-step ${index === step ? 'active' : ''} ${index < step ? 'completed' : ''}`}
            >
              {index < step ? <FaCheckCircle /> : index === step ? <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'currentColor' }}></div> : null}
              {text}
            </div>
          ))}
        </div>

        <div className="PaymentGateway-secureBadge">
          <FaShieldAlt /> 256-bit SSL Encrypted Connection
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
