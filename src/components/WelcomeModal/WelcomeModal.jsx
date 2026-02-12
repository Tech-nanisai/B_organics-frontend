import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaSignInAlt, FaEnvelope, FaPhone, FaTimes, FaCheckCircle, FaArrowRight, FaShieldAlt, FaLeaf } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/UserAuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import "./WelcomeModal.css";

const WelcomeModal = () => {
    const { isLoggedIn, login } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Check if modal should be shown
        const hasSeenModal = localStorage.getItem("welcomeModalDismissed");
        if (!isLoggedIn && !hasSeenModal) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                AOS.refresh();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("welcomeModalDismissed", "true");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5678/api/users/register", formData, { withCredentials: true });

            if (response.status === 201) {
                setSuccess(true);
                // Synchronize AuthContext immediately
                login();

                setTimeout(() => {
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="Welcome-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="Welcome-modal-content" data-aos="zoom-out-up">
                <button className="Welcome-close-btn" onClick={handleClose} aria-label="Close">
                    <FaTimes />
                </button>

                <div className="Welcome-modal-body">
                    {/* Visual Panel */}
                    <div className="Welcome-visual-panel">
                        <div className="Welcome-visual-content">
                            <div className="Welcome-logo-box">
                                <FaLeaf className="Welcome-mini-logo" />
                                <span>Borganics</span>
                            </div>
                            <h2>Discover Pure Living</h2>
                            <p>Experience the finest organic products delivered to your doorstep.</p>

                            <div className="Welcome-floating-badges">
                                <div className="Welcome-badge"><FaShieldAlt /> 100% Organic</div>
                                <div className="Welcome-badge"><FaCheckCircle /> Certified Pure</div>
                            </div>
                        </div>
                        <div className="Welcome-visual-overlay"></div>
                    </div>

                    {/* Form Panel */}
                    <div className="Welcome-form-panel">
                        <div className="Welcome-form-container">
                            <div className="Welcome-form-header-box">
                                <h3 className="Welcome-form-title">Join Community</h3>
                                <p className="Welcome-form-subtitle">Create an account to start your journey</p>
                            </div>

                            <form onSubmit={handleSubmit} className="Welcome-actual-form">
                                {errorMsg && <div className="Welcome-error-bubble">{errorMsg}</div>}

                                <div className="Welcome-input-stack">
                                    <div className="Welcome-input-group">
                                        <FaUser className="Welcome-field-icon" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="Welcome-input-group">
                                        <FaPhone className="Welcome-field-icon" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </div>

                                    <div className="Welcome-input-group">
                                        <FaEnvelope className="Welcome-field-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="Welcome-input-group">
                                        <FaLock className="Welcome-field-icon" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Security Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="Welcome-submit-btn" disabled={loading || success}>
                                    {loading ? (
                                        <div className="Welcome-spinner"></div>
                                    ) : success ? (
                                        <><FaCheckCircle /> Account Created!</>
                                    ) : (
                                        <>Join Borganics <FaArrowRight /></>
                                    )}
                                </button>

                                <p className="Welcome-policy-text">
                                    By joining, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
