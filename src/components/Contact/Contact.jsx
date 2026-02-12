import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Contact.css";
import ChatSupportLauncher from "../ChatSupport/ChatSupportLauncher";
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn,
  FaChevronDown, FaPaperPlane, FaFileUpload
} from "react-icons/fa";

const faqs = [
  { question: "How can I track my order?", answer: "Once your order is shipped, you will receive a tracking ID via email. You can also view real-time status in your Account Dashboard." },
  { question: "Are all products 100% organic?", answer: "Yes, we partner exclusively with certified organic farms. Every batch undergoes rigorous quality testing before reaching you." },
  { question: "What is your refund policy?", answer: "We offer a 'No Questions Asked' refund for damaged products reported within 24 hours of delivery." },
  { question: "Do you deliver pan-India?", answer: "Currently, we operate extensively across major Tier-1 and Tier-2 cities in India. Check your pincode at checkout for availability." },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="Contact-wrapper">
      <header className="Contact-banner" data-aos="fade-down">
        <h1 className="Contact-heroTitle">Get in Touch</h1>
        <p className="Contact-heroSubtitle">Have a question or feedback? We'd love to hear from you.</p>
      </header>

      <div className="Contact-body">
        {/* Left Column: Info & Map */}
        <aside className="Contact-sidebar">
          <div className="Contact-infoCard" data-aos="fade-up">
            <h3 className="Contact-cardTitle">Contact Information</h3>
            <div className="Contact-details">
              <div className="Contact-detailItem">
                <div className="Contact-iconBox"><FaEnvelope /></div>
                <div>
                  <label>Email Us</label>
                  <p>support@borganics.in</p>
                </div>
              </div>
              <div className="Contact-detailItem">
                <div className="Contact-iconBox"><FaPhoneAlt /></div>
                <div>
                  <label>Call Us</label>
                  <p>+91 99489 46688</p>
                </div>
              </div>
              <div className="Contact-detailItem">
                <div className="Contact-iconBox"><FaMapMarkerAlt /></div>
                <div>
                  <label>Our Head Office</label>
                  <p>Hyderabad, Telangana, India</p>
                </div>
              </div>
            </div>

            <div className="Contact-socials">
              <a href="https://facebook.com" className="Contact-socialBtn"><FaFacebookF /></a>
              <a href="https://instagram.com" className="Contact-socialBtn"><FaInstagram /></a>
              <a href="https://twitter.com" className="Contact-socialBtn"><FaTwitter /></a>
              <a href="https://linkedin.com" className="Contact-socialBtn"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="Contact-faqList" data-aos="fade-up" data-aos-delay="200">
            <h3 className="Contact-cardTitle">Common Questions</h3>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`Contact-faqItem ${activeFaq === index ? 'is-active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="Contact-faqHeader">
                  <span>{faq.question}</span>
                  <FaChevronDown className="Contact-faqIcon" />
                </div>
                <div className="Contact-faqAnswer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Column: Form */}
        <main className="Contact-main">
          <div className="Contact-formCard" data-aos="fade-left">
            <h3 className="Contact-cardTitle">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="Contact-form">
              <div className="Contact-formGrid">
                <div className="Contact-inputGroup">
                  <label>Full Name</label>
                  <input
                    type="text" name="name" placeholder="John Doe"
                    onChange={handleChange} required
                  />
                </div>
                <div className="Contact-inputGroup">
                  <label>Email Address</label>
                  <input
                    type="email" name="email" placeholder="john@example.com"
                    onChange={handleChange} required
                  />
                </div>
                <div className="Contact-inputGroup">
                  <label>Phone Number</label>
                  <input
                    type="tel" name="phone" placeholder="+91 00000 00000"
                    onChange={handleChange} required
                  />
                </div>
                <div className="Contact-inputGroup">
                  <label>Attachment (Optional)</label>
                  <div className="Contact-fileInput">
                    <FaFileUpload /> <span>Click to upload</span>
                    <input type="file" />
                  </div>
                </div>
              </div>

              <div className="Contact-inputGroup">
                <label>Your Message</label>
                <textarea
                  name="message" placeholder="How can we help you today?"
                  rows="6" onChange={handleChange} required
                ></textarea>
              </div>

              <button type="submit" className="Contact-submitBtn">
                Send Message <FaPaperPlane />
              </button>

              {submitted && (
                <div className="Contact-successMsg">
                  🎉 Message sent! Our team will get back to you within 24 hours.
                </div>
              )}
            </form>
          </div>

          <div className="Contact-mapBox" data-aos="fade-up">
            <iframe
              title="Locate Us"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8272!2d78.4482!3d17.4399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzIzLjYiTiA3OMKwMjYnNTMuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              loading="lazy"
            ></iframe>
          </div>
        </main>
      </div>

      <ChatSupportLauncher />
    </div>
  );
};

export default Contact;
