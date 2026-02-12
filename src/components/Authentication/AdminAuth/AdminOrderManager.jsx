import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaBox, FaUser, FaInfoCircle } from 'react-icons/fa';
import './AdminOrderManager.css';

const AdminOrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5678/api/orders', { withCredentials: true });
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5678/api/orders/${id}/status`, { status: newStatus }, { withCredentials: true });
            fetchOrders();
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
            }
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Received': return <FaClock className="status-icon received" />;
            case 'Confirmed': return <FaCheckCircle className="status-icon confirmed" />;
            case 'Processing': return <FaBox className="status-icon processing" />;
            case 'Shipped': return <FaTruck className="status-icon shipped" />;
            case 'Delivered': return <FaCheckCircle className="status-icon delivered" />;
            case 'Cancelled': return <FaTimesCircle className="status-icon cancelled" />;
            case 'Refunded': return <FaInfoCircle className="status-icon refunded" />;
            default: return null;
        }
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter);

    return (
        <div className="admin-order-manager">
            <div className="order-filters">
                {['All', 'Received', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map(status => (
                    <button
                        key={status}
                        className={`filter-tab ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-spinner">Fetching Orders...</div>
            ) : (
                <div className="orders-container">
                    <div className="order-list">
                        {filteredOrders.length === 0 ? (
                            <div className="no-orders">No orders found for this status.</div>
                        ) : (
                            filteredOrders.map(order => (
                                <div
                                    key={order._id}
                                    className={`order-card ${selectedOrder?._id === order._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="order-card-header">
                                        <span className="order-id">#{order.orderId}</span>
                                        <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                                            {getStatusIcon(order.orderStatus)} {order.orderStatus}
                                        </span>
                                    </div>
                                    <div className="order-card-info">
                                        <p><FaUser /> {order.user.fullName || 'Guest'}</p>
                                        <p><FaShoppingCart /> ₹{order.totalAmount} • {order.items.length} items</p>
                                    </div>
                                    <div className="order-card-footer">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="order-detail-view">
                        {selectedOrder ? (
                            <div className="order-details">
                                <div className="details-header">
                                    <h3>Order Details</h3>
                                    <div className="id-badge">ID: {selectedOrder.orderId}</div>
                                </div>

                                <div className="detail-section">
                                    <h4><FaUser /> Customer Information</h4>
                                    <div className="info-grid">
                                        <p><strong>Name:</strong> {selectedOrder.user.fullName}</p>
                                        <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.user.phone || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4><FaTruck /> Shipping Address</h4>
                                    <div className="address-box">
                                        <p>{selectedOrder.shippingAddress.houseNo}, {selectedOrder.shippingAddress.village}</p>
                                        <p>{selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4><FaBox /> Order Items</h4>
                                    <div className="items-list">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="item-row">
                                                <span>{item.name} x {item.qty}</span>
                                                <span>₹{item.price * item.qty}</span>
                                            </div>
                                        ))}
                                        <div className="order-total-row">
                                            <span>Total Amount</span>
                                            <span className="total-val">₹{selectedOrder.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Order Status Management</h4>
                                    <div className="status-actions">
                                        {['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map(status => (
                                            <button
                                                key={status}
                                                className={`status-btn ${status.toLowerCase()} ${selectedOrder.orderStatus === status ? 'current' : ''}`}
                                                onClick={() => updateStatus(selectedOrder._id, status)}
                                            >
                                                Mark as {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-order-selected">
                                <FaShoppingCart className="placeholder-icon" />
                                <p>Select an order from the list to view details and manage status.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderManager;
