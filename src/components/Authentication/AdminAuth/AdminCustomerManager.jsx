import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaEnvelope, FaPhone, FaCalendarAlt, FaIdBadge, FaSearch, FaEllipsisV } from 'react-icons/fa';
import './AdminCustomerManager.css';

const AdminCustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get('https://b-organics-backend.onrender.com/api/users', { withCredentials: true });
            setCustomers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching customers:", err);
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nanoid.includes(searchTerm)
    );

    return (
        <div className="admin-customer-manager">
            <div className="manager-header">
                <div className="search-bar">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search by name, email or NanoID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="customer-stats">
                    Total Customers: <strong>{customers.length}</strong>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading Customer Directory...</div>
            ) : (
                <div className="customer-grid">
                    {filteredCustomers.length === 0 ? (
                        <div className="no-results">No customers match your search.</div>
                    ) : (
                        filteredCustomers.map(customer => (
                            <div key={customer._id} className="customer-card">
                                <div className="card-top">
                                    <div className="customer-avatar">
                                        {customer.fullName.substring(0, 1).toUpperCase()}
                                    </div>
                                    <button className="more-options"><FaEllipsisV /></button>
                                </div>
                                <div className="customer-details">
                                    <h3>{customer.fullName}</h3>
                                    <div className="id-tag"><FaIdBadge /> {customer.nanoid}</div>

                                    <div className="contact-info">
                                        <p><FaEnvelope /> {customer.email}</p>
                                        <p><FaPhone /> {customer.phone || 'No phone added'}</p>
                                    </div>

                                    <div className="card-footer">
                                        <span><FaCalendarAlt /> Joined: {new Date(customer.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminCustomerManager;
