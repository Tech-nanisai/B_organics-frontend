import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/UserAuthContext';
import { FaBox, FaClock, FaTruck, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaRupeeSign, FaShoppingBag, FaTrash } from 'react-icons/fa';
import './UserOrders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const { userData } = useAuth();

    useEffect(() => {
        if (userData) {
            fetchUserOrders();
        }
    }, [userData]);

    const fetchUserOrders = async () => {
        try {
            const res = await axios.get('https://b-organics-backend.onrender.com/api/orders/user', { withCredentials: true });
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user orders:", err);
            setLoading(false);
        }
    };

    const openRemoveModal = (id) => {
        setOrderToDelete(id);
        setShowModal(true);
    };

    const handleRemoveOrder = async () => {
        if (!orderToDelete) return;
        try {
            await axios.delete(`https://b-organics-backend.onrender.com/api/orders/user/${orderToDelete}`, { withCredentials: true });
            setOrders(orders.filter(order => order._id !== orderToDelete));
            setShowModal(false);
            setOrderToDelete(null);
        } catch (err) {
            alert("Failed to remove order. Please try again later.");
            setShowModal(false);
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
            default: return <FaShoppingBag />;
        }
    };

    if (loading) {
        return <div className="orders-loading">Syncing your order history...</div>;
    }

    return (
        <div className="user-orders-container">
            <h2 className="page-title">My Orders</h2>

            {orders.length === 0 ? (
                <div className="no-orders-view">
                    <FaShoppingBag className="empty-icon" />
                    <h3>No orders yet!</h3>
                    <p>When you buy something, it will appear here.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-history-card">
                            <div className="order-header">
                                <div className="header-main">
                                    <span className="order-id">Order ID: #{order.orderId}</span>
                                    <span className={`status-pill ${order.orderStatus.toLowerCase()}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div className="header-meta">
                                    <span className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </span>
                                    <button
                                        className="remove-order-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openRemoveModal(order._id);
                                        }}
                                        title="Remove from history"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="order-body">
                                <div className="items-preview">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <div className="item-img-placeholder">
                                                {item.image ? <img src={item.image} alt={item.name} /> : <FaBox />}
                                            </div>
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-meta">Qty: {item.qty} • Price: ₹{item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="address-preview">
                                    <h4>Delivery Address</h4>
                                    <p>{order.shippingAddress.houseNo}, {order.shippingAddress.village}</p>
                                    <p>{order.shippingAddress.district}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                </div>
                            </div>

                            <div className="order-footer">
                                <span className="payment-method">Payment: {order.paymentMethod}</span>
                                <div className="total-amount">
                                    <span>Total Amount:</span>
                                    <span className="price-val">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Premium Confirm Modal */}
            {showModal && (
                <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon-wrapper">
                            <FaTrash className="modal-danger-icon" />
                        </div>
                        <h3>Permanently Remove Order?</h3>
                        <p>This will remove the order from your history. You won't be able to track it or view its details again.</p>
                        <div className="modal-actions-btns">
                            <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                                Keep Order
                            </button>
                            <button className="modal-confirm-btn" onClick={handleRemoveOrder}>
                                Yes, Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
