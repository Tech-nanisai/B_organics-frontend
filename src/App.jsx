// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './components/LandingPage/Landingpage';
import Footer from './components/Footer/footer';
import Navbar from './components/Navbar/Navbar';
import Honey from './components/Products/HoneyProduct/Honey';
import Vegetables from './components/Products/VegetablesProduct/Vegetables';
import Coffee from './components/Products/CoffeeProduct/Coffee';
import Fruits from './components/Products/FruitsProduct/Fruits';
import AllProducts from './components/AllProducts/Allproducts';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart/Cart';
import PlaceOrder from "./components/PlaceOrder/PlaceOrder";
import PaymentGateway from './components/PaymentGateway/PaymentGateway.jsx';
import OrderSuccess from './components/OrderSuccess/OrderSuccess.jsx';
import SearchResults from "./components/SearchResults/SearchResults.jsx";
import ChatSupport from "./components/ChatSupport/ChatSupport";
import ChatSupportLauncher from './components/ChatSupport/ChatSupportLauncher.jsx';
import Contact from './components/Contact/Contact.jsx';
import UserProfile from './components/Authentication/CustomerAuth/UserProfile/userprofile.jsx';
import UserOrders from './components/Orders/UserOrders.jsx';
import AboutUs from './components/AboutUs/AboutUs.jsx';
import ProductDetails from "./components/ProductDetails/ProductDetails";
// authentication routes
import UserRegister from './components/Authentication/CustomerAuth/UserRegister/UserRegister.jsx';
import UserLogin from './components/Authentication/CustomerAuth/UserLogin/UserLogin.jsx';
import AdminRegister from './components/Authentication/AdminAuth/AdminRegister.jsx';
import AdminLogin from './components/Authentication/AdminAuth/AdminLogin.jsx';
import AdminDashboard from './components/Authentication/AdminAuth/AdminDashboard.jsx';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsOfService from './components/Legal/TermsOfService';
import { NanoidProvider } from "./context/NanoidContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Helper Layout Component for Customer Pages
const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/honey" element={<Honey />} />
        <Route path="/vegetables" element={<Vegetables />} />
        <Route path="/coffee" element={<Coffee />} />
        <Route path="/fruits" element={<Fruits />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<PlaceOrder />} />
        <Route path="/payment-gateway" element={<PaymentGateway />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/search-products" element={<SearchResults />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/Chat-support" element={<ChatSupport />} />
        {/* authentication routes that share the customer navbar */}
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* catch-all for customer side 404s if needed, or specific ones */}
        <Route path="*" element={<h2>Page not found</h2>} />
      </Routes>
      <ChatSupportLauncher />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <>
      <CartProvider>
        <WelcomeModal />
        <div className="app-container">
          <NanoidProvider>
            <Routes>
              {/* Admin Routes - No Customer Navbar/Footer */}
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Dashboard and its sub-sections */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminDashboard />} />

              {/* Customer Routes - Includes Navbar/Footer */}
              <Route path="*" element={<CustomerLayout />} />
            </Routes>
          </NanoidProvider>
        </div>
      </CartProvider>
    </>
  );
};

export default App;
