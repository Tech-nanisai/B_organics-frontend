import React, { useEffect } from "react";
import "./Legal.css";
import AOS from "aos";
import "aos/dist/aos.css";

const PrivacyPolicy = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="Legal-container" data-aos="fade-up">
            <h1 className="Legal-title">Privacy Policy</h1>
            <p className="Legal-lastUpdated">Last Updated: February 12, 2026</p>

            <div className="Legal-section">
                <h2>1. Introduction</h2>
                <p>
                    Welcome to Borganics. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website and services.
                </p>
            </div>

            <div className="Legal-section">
                <h2>2. Information We Collect</h2>
                <p>
                    We collect information that you provide to us directly, such as when you create an account, place an order, or subscribe to our newsletter. This may include your name, email address, phone number, shipping address, and payment information.
                </p>
                <p>
                    We also collect technical data automatically, such as your IP address, browser type, and usage patterns through cookies and similar technologies.
                </p>
            </div>

            <div className="Legal-section">
                <h2>3. How We Use Your Information</h2>
                <p>
                    We use your information to:
                    <ul>
                        <li>Process and fulfill your orders.</li>
                        <li>Communicate with you about your account and purchases.</li>
                        <li>Provide customer support.</li>
                        <li>Send you promotional offers and updates (if you've opted in).</li>
                        <li>Improve our website and services.</li>
                        <li>Ensure the security of our platform.</li>
                    </ul>
                </p>
            </div>

            <div className="Legal-section">
                <h2>4. Data Sharing and Disclosure</h2>
                <p>
                    We do not sell your personal information to third parties. We may share your data with trusted partners who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
                </p>
            </div>

            <div className="Legal-section">
                <h2>5. Data Security</h2>
                <p>
                    We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                </p>
            </div>

            <div className="Legal-section">
                <h2>6. Cookies</h2>
                <p>
                    We use cookies to enhance your experience, gather general visitor information, and track visits to our website. You can choose to turn off all cookies via your browser settings.
                </p>
            </div>

            <div className="Legal-section">
                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions regarding this Privacy Policy, you may contact us using the information below:
                    <br />
                    Email: support@borganics.in
                    <br />
                    Address: Plot 102, Green Valley, Hyderabad, Telangana, India - 500081
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
