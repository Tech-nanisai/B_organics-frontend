import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane
} from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="Footer-container">
      {/* Newsletter Section */}
      <div className="Footer-newsletter">
        <h3 className="Footer-newsletterTitle">Join the Organic Revolution</h3>
        <p className="Footer-newsletterText">
          Subscribe for exclusive offers, healthy recipes, and sustainable living tips.
        </p>
        <div className="Footer-inputGroup">
          <input
            type="email"
            placeholder="Enter your email address"
            className="Footer-input"
          />
          <button className="Footer-btn">Subscribe</button>
        </div>
      </div>

      <div className="Footer-grid">
        {/* Brand Section */}
        <div className="Footer-brand">
          <div className="Footer-logoWrapper">
            <img
              src="https://res.cloudinary.com/drevfgyks/image/upload/v1713367084/B%20organics/Logo.jpeg_mermiy.jpg"
              alt="Borganics Logo"
              className="Footer-logo"
            />
            <h3 className="Footer-brandName">Borganics</h3>
          </div>
          <p className="Footer-brandDesc">
            Connecting you directly with nature. We source the purest organic produce from certified farmers to ensure a healthier you and a greener planet.
          </p>
          <div className="Footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="Footer-socialLink" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="Footer-socialLink" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="Footer-socialLink" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="Footer-socialLink" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="Footer-section">
          <h4 className="Footer-heading">Quick Links</h4>
          <ul className="Footer-links">
            <li><Link to="/" className="Footer-link">Home</Link></li>
            <li><Link to="/about" className="Footer-link">About Us</Link></li>
            <li><Link to="/shop" className="Footer-link">Shop Now</Link></li>
            <li><Link to="/contact" className="Footer-link">Contact Us</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="Footer-section">
          <h4 className="Footer-heading">Categories</h4>
          <ul className="Footer-links">
            <li><Link to="/honey" className="Footer-link">Organic Honey</Link></li>
            <li><Link to="/coffee" className="Footer-link">Artisan Coffee</Link></li>
            <li><Link to="/vegetables" className="Footer-link">Fresh Vegetables</Link></li>
            <li><Link to="/fruits" className="Footer-link">Seasonal Fruits</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="Footer-section">
          <h4 className="Footer-heading">Contact Us</h4>
          <div className="Footer-contactItem">
            <FaPhoneAlt className="Footer-contactIcon" />
            <span>+91 9090909090</span>
          </div>
          <div className="Footer-contactItem">
            <FaEnvelope className="Footer-contactIcon" />
            <span>support@borganics.in</span>
          </div>
          <div className="Footer-contactItem">
            <FaMapMarkerAlt className="Footer-contactIcon" />
            <span>Plot 102, Green Valley, Hyderabad, Telangana, India - 500081</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="Footer-bottom">
        <div className="Footer-copyright">
          <p>© {new Date().getFullYear()} Borganics. All rights reserved.</p>
          <p className="Footer-developer">
            Developed by <a href="https://www.nxorsystems.com" target="_blank" rel="noopener noreferrer">NXOR Systems</a>
          </p>
        </div>
        <div className="Footer-bottomLinks">
          <Link to="/privacy" className="Footer-bottomLink">Privacy Policy</Link>
          <Link to="/terms" className="Footer-bottomLink">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
