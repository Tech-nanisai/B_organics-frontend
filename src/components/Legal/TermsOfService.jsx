import React, { useEffect } from "react";
import "./Legal.css";
import AOS from "aos";
import "aos/dist/aos.css";

const TermsOfService = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="Legal-container" data-aos="fade-up">
            <h1 className="Legal-title">Terms of Service</h1>
            <p className="Legal-lastUpdated">Last Updated: February 12, 2026</p>

            <div className="Legal-section">
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using Borganics, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
            </div>

            <div className="Legal-section">
                <h2>2. Eligibility</h2>
                <p>
                    You must be at least 18 years old to use our services or have the consent of a legal guardian. By using the site, you represent and warrant that you meet these eligibility requirements.
                </p>
            </div>

            <div className="Legal-section">
                <h2>3. Account Responsibilities</h2>
                <p>
                    If you create an account on our site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
                </p>
            </div>

            <div className="Legal-section">
                <h2>4. Product Availability and Pricing</h2>
                <p>
                    All products and services are subject to availability. We reserve the right to limit the quantities of any products or services that we offer. Prices for our products are subject to change without notice.
                </p>
            </div>

            <div className="Legal-section">
                <h2>5. Intellectual Property</h2>
                <p>
                    All content included on this site, such as text, graphics, logos, images, and software, is the property of Borganics or its content suppliers and protected by international copyright laws.
                </p>
            </div>

            <div className="Legal-section">
                <h2>6. Limitation of Liability</h2>
                <p>
                    In no event shall Borganics or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Borganics' website.
                </p>
            </div>

            <div className="Legal-section">
                <h2>7. Governing Law</h2>
                <p>
                    These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
                </p>
            </div>

            <div className="Legal-section">
                <h2>8. Changes to Terms</h2>
                <p>
                    Borganics may revise these Terms of Service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
