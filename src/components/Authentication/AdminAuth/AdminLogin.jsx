import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/UserAuthContext';
import './AdminAuth.css';
import { FaLock, FaUserShield } from 'react-icons/fa';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, userData } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // If already logged in as admin, redirect
    useEffect(() => {
        if (userData?.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [userData, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShowForgotPassword(false);
        setLoading(true);

        try {
            await axios.post('https://b-organics-backend.onrender.com/api/admin/login', formData, {
                withCredentials: true
            });

            // Update global context
            login();

            // Set auto-logout timer for 60 minutes (client-side backup to cookie)
            // Note: Ideally this should be handled by a global session manager, but keeping it here as requested previously
            setTimeout(() => {
                window.location.href = "/"; // Force reload/redirect
            }, 60 * 60 * 1000);

            // Redirect to Admin Dashboard
            navigate('/admin/dashboard');

        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed.';
            setError(msg);

            // Show Forgot Password option if password was wrong
            if (err.response?.status === 401 || msg.toLowerCase().includes('password')) {
                setShowForgotPassword(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-container">
            <div className="admin-auth-card">
                <div className="admin-auth-header">
                    <span className="admin-auth-logo">
                        <FaUserShield style={{ marginRight: '10px' }} />
                        Admin Sign In
                    </span>
                    <p className="admin-auth-subtitle">Secure access for administrators</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                <form className="admin-auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@borganics.in"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {showForgotPassword && (
                        <Link to="/forgot-password" class="forgot-password">
                            Forgot Password?
                        </Link>
                    )}

                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? <div className="spinner"></div> : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an admin account?
                    <Link to="/admin/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
