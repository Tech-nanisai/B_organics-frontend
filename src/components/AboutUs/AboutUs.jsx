import React, { useEffect } from "react";
import "./AboutUs.css";
import { FaLeaf, FaHandHoldingHeart, FaGlobeAmericas, FaSeedling } from "react-icons/fa";

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="About-container">
            {/* Hero Section */}
            <header className="About-hero">
                <h1 className="About-title">
                    Cultivating <br /> The Future
                </h1>
                <p className="About-subtitle">
                    est. 2024 • Borganics Elite
                </p>
            </header>

            {/* Narrative Section 1 - Origin */}
            <div className="About-narrative">
                <section className="About-section">
                    <div className="About-imageWrapper">
                        <img
                            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2938&auto=format&fit=crop"
                            alt="Organic Farm Field"
                            className="About-image"
                            loading="lazy"
                        />
                    </div>
                    <div className="About-content">
                        <div className="About-divider"></div>
                        <h2 className="About-heading">The Genesis</h2>
                        <p className="About-text">
                            Born from a desire to reconnect humanity with the earth, Borganics was founded on a simple yet profound principle: purity above all. We saw a world saturated with synthetics and yearned for the authentic taste of nature. Our journey began in the fertile valleys of India, where traditional farming wisdom meets modern sustainability.
                        </p>
                        <p className="About-text">
                            We don't just sell products; we curate experiences. Every jar of honey, every grain of coffee, and every basket of produce tells a story of the soil it sprang from and the hands that nurtured it.
                        </p>
                    </div>
                </section>

                {/* Narrative Section 2 - Philosophy (Reversed) */}
                <section className="About-section rev">
                    <div className="About-content">
                        <div className="About-divider"></div>
                        <h2 className="About-heading">Uncompromising Standard</h2>
                        <p className="About-text">
                            In an industry of shortcuts, we take the long road. We believe that true luxury lies in health and transparency. Our "Elite White" standard isn't just a label—it's a rigorous promise. Zero pesticides, zero additives, and 100% traceability from farm to table.
                        </p>
                        <p className="About-text">
                            We partner exclusively with heritage farmers who treat their land with reverence, ensuring that every harvest is not only organic but regenerative, healing the planet as it nourishes you.
                        </p>
                    </div>
                    <div className="About-imageWrapper">
                        <img
                            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2940&auto=format&fit=crop"
                            alt="Hands holding organic soil"
                            className="About-image"
                            loading="lazy"
                        />
                    </div>
                </section>
            </div>

            {/* Stats Section */}
            <section className="About-stats">
                <div className="About-stat-item">
                    <FaLeaf size={32} color="#15803d" style={{ marginBottom: '0.5rem' }} />
                    <div className="About-stat-number">100%</div>
                    <div className="About-stat-label">Organic Certified</div>
                </div>
                <div className="About-stat-item">
                    <FaHandHoldingHeart size={32} color="#15803d" style={{ marginBottom: '0.5rem' }} />
                    <div className="About-stat-number">50+</div>
                    <div className="About-stat-label">Partner Farms</div>
                </div>
                <div className="About-stat-item">
                    <FaGlobeAmericas size={32} color="#15803d" style={{ marginBottom: '0.5rem' }} />
                    <div className="About-stat-number">10k+</div>
                    <div className="About-stat-label">Happy Families</div>
                </div>
                <div className="About-stat-item">
                    <FaSeedling size={32} color="#15803d" style={{ marginBottom: '0.5rem' }} />
                    <div className="About-stat-number">24h</div>
                    <div className="About-stat-label">Harvest to Home</div>
                </div>
            </section>

            {/* Core Values */}
            <section className="About-values">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 className="About-heading">Our Ethos</h2>
                    <p className="About-subtitle">The Pillars of Borganics</p>
                </div>
                <div className="About-values-grid">
                    <div className="About-value-card">
                        <h3 className="About-value-title">Transparency</h3>
                        <p className="About-value-desc">
                            We believe you have the right to know exactly where your food comes from. Scan any product to trace its journey back to the source.
                        </p>
                    </div>
                    <div className="About-value-card">
                        <h3 className="About-value-title">Sustainability</h3>
                        <p className="About-value-desc">
                            Our packaging is minimal, recyclable, and plastic-free wherever possible. We strive to leave the earth better than we found it.
                        </p>
                    </div>
                    <div className="About-value-card">
                        <h3 className="About-value-title">Excellence</h3>
                        <p className="About-value-desc">
                            Good isn't enough. We pursue the exceptional. Only the finest produce makes the cut for the Borganics Elite collection.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
