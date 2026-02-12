import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaCheckCircle, FaArrowRight, FaLeaf, FaShieldAlt } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/UserAuthContext";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import "./UserRegister.css";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5678/api/users/register", formData, {
        withCredentials: true
      });

      if (response.status === 201) {
        setSuccess(true);
        // Synchronize AuthContext
        login();

        setTimeout(() => {
          const redirectPath = location.state?.from || "/";
          navigate(redirectPath);
        }, 2000);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMsg(error.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-register-container">
      {/* ... visual side ... */}
      <div className="register-visual-side" data-aos="fade-right">
        <div className="brand-overlay">
          <div className="brand-badge" data-aos="zoom-in" data-aos-delay="500">
            <FaLeaf /> 100% Organic
          </div>
          <h2 data-aos="fade-up" data-aos-delay="600">Join the <br /> Borganics Community</h2>
          <p data-aos="fade-up" data-aos-delay="700">Access exclusive organic produce, member-only deals, and a healthier lifestyle.</p>

          <div className="trust-indicators" data-aos="fade-up" data-aos-delay="800">
            <div className="trust-item"><FaShieldAlt /> <span>Secure Archive</span></div>
            <div className="trust-item"><FaCheckCircle /> <span>Verified Farmer Direct</span></div>
          </div>
        </div>
      </div>

      <div className="register-form-side" data-aos="fade-left">
        <form onSubmit={handleSubmit} className="glass-register-form">
          <div className="form-header">
            <div className="mini-logo">
              <FaLeaf />
            </div>
            <h2 className="premium-title">Registration</h2>
            <p>Enter your details to create an account</p>
          </div>

          {errorMsg && <div className="error-bubble" data-aos="shake">{errorMsg}</div>}

          <div className="premium-input-grid">
            <div className="premium-input-group">
              <div className="icon-box"><FaUser /></div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="premium-input-group">
              <div className="icon-box"><FaPhone /></div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="premium-input-group full-width">
              <div className="icon-box"><FaEnvelope /></div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="premium-input-group full-width">
              <div className="icon-box"><FaLock /></div>
              <input
                type="password"
                name="password"
                placeholder="Secure Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="premium-register-btn" disabled={loading || success}>
            {loading ? (
              <div className="spinner"></div>
            ) : success ? (
              <><FaCheckCircle /> Account Created!</>
            ) : (
              <><FaArrowRight /> Create Account</>
            )}
          </button>

          {success && (
            <div className="success-message-inline" data-aos="zoom-in">
              Welcome aboard! Redirecting back...
            </div>
          )}

          <p className="redirect-text">
            Already a member? <Link to="/login" state={{ from: location.state?.from }}>Sign In</Link>
          </p>

          <p className="legal-notice">
            By registering, you agree to our <span>Terms</span> and <span>Privacy Policy</span>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
