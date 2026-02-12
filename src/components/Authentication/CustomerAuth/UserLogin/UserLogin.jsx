import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaSignInAlt, FaLeaf, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/UserAuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import "./UserLogin.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5678/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      login();
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-login-container">
      {/* Visual Side */}
      <div className="login-visual-side" data-aos="fade-right">
        <div className="brand-overlay">
          <div className="brand-badge" data-aos="zoom-in" data-aos-delay="500">
            <FaLeaf /> Organic Excellence
          </div>
          <h2 data-aos="fade-up" data-aos-delay="600">Access Your <br /> Borganics Account</h2>
          <p data-aos="fade-up" data-aos-delay="700">Continue your journey with the purest products sourced directly from nature.</p>

          <div className="trust-indicators" data-aos="fade-up" data-aos-delay="800">
            <div className="trust-item"><FaShieldAlt /> <span>Secure Authentication</span></div>
            <div className="trust-item"><FaCheckCircle /> <span>Verified User Portal</span></div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="login-form-side" data-aos="fade-left">
        <form className="glass-login-form" onSubmit={handleLogin}>
          <div className="form-header">
            <div className="mini-logo">
              <FaLeaf />
            </div>
            <h2 className="premium-title">Welcome Back</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {errorMsg && <div className="error-bubble" data-aos="shake">{errorMsg}</div>}

          <div className="premium-input-stack">
            <div className="premium-input-group">
              <div className="icon-box"><FaUser /></div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="premium-input-group">
              <div className="icon-box"><FaLock /></div>
              <input
                type="password"
                placeholder="Security Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="premium-login-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : <><FaSignInAlt /> Secure Sign In</>}
          </button>

          <p className="redirect-text">
            New to Borganics? <Link to="/register" state={{ from: location.state?.from }}>Create Account</Link>
          </p>

          <p className="legal-notice">
            Your security is our priority. All connections are encrypted.
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
