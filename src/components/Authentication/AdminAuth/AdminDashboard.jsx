import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/UserAuthContext';
import './AdminDashboard.css';
import {
    FaChartLine,
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaLeaf
} from 'react-icons/fa';
import AdminProductManager from './AdminProductManager';
import AdminOrderManager from './AdminOrderManager';
import AdminCustomerManager from './AdminCustomerManager';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
        { path: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
        { path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart /> },
        { path: '/admin/users', label: 'Customers', icon: <FaUsers /> },
        { path: '/admin/settings', label: 'Settings', icon: <FaCog /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <FaLeaf className="brand-icon" />
                    <span>Borganics Admin</span>
                </div>
                <button className="close-sidebar-btn" onClick={toggleSidebar}>
                    <FaTimes />
                </button>
            </div>

            <div className="sidebar-menu">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [stats, setStats] = useState({
        totalSales: 0,
        activeOrders: 0,
        totalCustomers: 0,
        totalProducts: 0
    });
    const { logout, userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                axios.get('https://b-organics-backend.onrender.com/api/orders', { withCredentials: true }),
                axios.get('https://b-organics-backend.onrender.com/api/users', { withCredentials: true }),
                axios.get('https://b-organics-backend.onrender.com/api/products')
            ]);

            const deliveredOrders = ordersRes.data.filter(o => o.orderStatus === 'Delivered');
            const totalSales = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
            const activeOrders = ordersRes.data.filter(o => ['Received', 'Processing', 'Shipped'].includes(o.orderStatus)).length;

            setStats({
                totalSales,
                activeOrders,
                totalCustomers: usersRes.data.length,
                totalProducts: productsRes.data.length
            });
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleProfileMenu = () => {
        setProfileMenuOpen(!profileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Determine page title based on route
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('products')) return 'Product Management';
        if (path.includes('orders')) return 'Order Management';
        if (path.includes('users')) return 'Customer Directory';
        if (path.includes('settings')) return 'Admin Settings';
        return 'Dashboard Overview';
    };

    return (
        <div className="admin-layout">
            <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="admin-header">
                    <div className="header-left-section">
                        <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                        <h2>{getPageTitle()}</h2>
                    </div>

                    <div className="admin-profile-section">
                        <div className="admin-profile-trigger" onClick={toggleProfileMenu}>
                            <div className="admin-info">
                                <span className="admin-name">{userData?.fullName || 'Admin'}</span>
                                <span className="admin-role">Super Admin</span>
                            </div>
                            <div className="admin-avatar">
                                {userData?.fullName?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                        </div>

                        {profileMenuOpen && (
                            <div className="admin-dropdown-menu">
                                <div className="dropdown-header">
                                    <p className="user-email">{userData?.email}</p>
                                </div>
                                <Link to="/admin/settings" className="dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                                    <FaCog /> Settings
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="admin-content-area">
                    {location.pathname === '/admin/dashboard' && (
                        <>
                            <div className="dashboard-widgets">
                                <div className="widget-card">
                                    <h3>Total Sales</h3>
                                    <p className="widget-value">₹ {stats.totalSales.toLocaleString('en-IN')}</p>
                                    <span className="widget-trend positive">+Delivered Only</span>
                                </div>
                                <div className="widget-card">
                                    <h3>Active Orders</h3>
                                    <p className="widget-value">{stats.activeOrders}</p>
                                    <span className="widget-trend processing">Processing/Shipped</span>
                                </div>
                                <div className="widget-card">
                                    <h3>Total Customers</h3>
                                    <p className="widget-value">{stats.totalCustomers}</p>
                                    <span className="widget-trend positive">Registered Users</span>
                                </div>
                                <div className="widget-card">
                                    <h3>Total Products</h3>
                                    <p className="widget-value">{stats.totalProducts}</p>
                                    <span className="widget-trend neutral">In Inventory</span>
                                </div>
                            </div>

                            <div className="recent-activity-section">
                                <h3>Recent Activity</h3>
                                <p>No recent activity logs found.</p>
                            </div>
                        </>
                    )}

                    {location.pathname === '/admin/products' && <AdminProductManager />}
                    {location.pathname === '/admin/orders' && <AdminOrderManager />}
                    {location.pathname === '/admin/users' && <AdminCustomerManager />}

                    {location.pathname === '/admin/settings' && (
                        <div className="placeholder-content">
                            <h3>Section: Admin Settings</h3>
                            <p>Global configuration and security settings are being synchronized...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
