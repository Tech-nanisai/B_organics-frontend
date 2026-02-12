import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAuth.css';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserShield } from 'react-icons/fa';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:5678/api/admin/register', formData);
            navigate('/admin/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                        Admin Portal
                    </span>
                    <p className="admin-auth-subtitle">Create a new administrative account</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                <form className="admin-auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Set a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? <div className="spinner"></div> : 'Register Admin'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <Link to="/admin/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
