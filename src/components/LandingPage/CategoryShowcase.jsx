import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaMagic, FaTint, FaMugHot, FaCarrot, FaAppleAlt, FaMinus } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Landingpage.css";

const productData = {
  honey: {
    name: "Wild Forest",
    suffix: "Nectar",
    subtitle: "Sustainably harvested nectar from certified organic forest reserves.",
    details: ["Raw & Unfiltered", "Bio-Active Enzymes", "Traceable Origin"],
    icon: <FaTint />,
    id: "01",
    meta: "LAT 12.97 / LONG 77.59 / REV. 2024"
  },
  coffee: {
    name: "Estate",
    suffix: "Bean",
    subtitle: "Precision roasted micro-batches from high-altitude single estates.",
    details: ["Single Origin", "Artisanal Roast", "Direct Trade"],
    icon: <FaMugHot />,
    id: "02",
    meta: "ALT 1800m / ARABICA / BR-EST 04"
  },
  vegetables: {
    name: "Organic",
    suffix: "Produce",
    subtitle: "Non-GMO heirloom varieties grown in nutrient-rich living soil.",
    details: ["Pesticide Free", "Daily Harvest", "Nutrient Dense"],
    icon: <FaCarrot />,
    id: "03",
    meta: "SOIL PH 6.8 / VAR. HEIRLOOM / LVL 1"
  },
  fruits: {
    name: "Seasonal",
    suffix: "Harvest",
    subtitle: "Naturally ripened fruits delivered at their peak nutritional value.",
    details: ["Tree Ripened", "No Synthetics", "Pure Vitality"],
    icon: <FaAppleAlt />,
    id: "04",
    meta: "BRIX 14.2 / VIT-C OPT / NAT-RIP"
  }
};

const ProductShowcase = () => {
  const [selected, setSelected] = useState("honey");
  const [isChanging, setIsChanging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200, once: false });
  }, []);

  const handleSwitch = (key) => {
    if (key === selected) return;
    setIsChanging(true);
    setTimeout(() => {
      setSelected(key);
      setIsChanging(false);
    }, 500);
  };

  const product = productData[selected];

  return (
    <section className="Showcase-elite-root">
      <div className="Showcase-elite-container">

        {/* Luxury Meta Header */}
        <header className="Showcase-elite-header" data-aos="fade-up">
          <div className="elite-indicator">
            <span className="dot"></span>
            <span className="tag">Archive Selection v2.0</span>
          </div>
          <h2 className="elite-main-title">
            <span className="thin">Discover Our</span> <span className="bold">Collections</span>
          </h2>
          <div className="elite-divider"></div>
        </header>

        <div className="Showcase-elite-layout">
          {/* Vertical Index Navigation */}
          <nav className="Showcase-elite-nav">
            {Object.keys(productData).map((key) => (
              <button
                key={key}
                className={`elite-nav-item ${selected === key ? 'is-active' : ''}`}
                onClick={() => handleSwitch(key)}
              >
                <div className="nav-progress-bar"></div>
                <div className="nav-content-box">
                  <span className="nav-index">{productData[key].id}</span>
                  <span className="nav-label-text">{productData[key].name} {productData[key].suffix}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* Master Display Monolith */}
          <main className={`Showcase-master-monolith ${isChanging ? 'is-syncing' : ''}`}>
            {/* The Cinematic Scan Effect */}
            <div className="monolith-scan-flare"></div>

            <div className="monolith-inner-context">
              <div className="monolith-visual-aside" data-aos="zoom-out">
                <div className="monolith-icon-capsule">
                  {product.icon}
                </div>
                <span className="monolith-technical-meta">{product.meta}</span>
              </div>

              <div className="monolith-content-side">
                <div className="monolith-title-reveal" data-aos="reveal-up">
                  <h3 className="monolith-product-name">
                    <span className="name-primary">{product.name}</span>
                    <span className="name-suffix">{product.suffix}</span>
                  </h3>
                </div>

                <p className="monolith-product-desc" data-aos="fade-up" data-aos-delay="200">
                  {product.subtitle}
                </p>

                <div className="monolith-spec-list">
                  {product.details.map((detail, i) => (
                    <div key={i} className="spec-row" style={{ '--delay': `${i * 0.15}s` }}>
                      <span className="spec-bullet">0{i + 1}</span>
                      <span className="spec-text">{detail}</span>
                    </div>
                  ))}
                </div>

                <footer className="monolith-footer" data-aos="fade-up" data-aos-delay="400">
                  <button className="elite-cta-magnetic" onClick={() => navigate(`/${selected}`)}>
                    <span className="cta-label">Explore Full Collection</span>
                    <div className="cta-icon-box">
                      <FaArrowRight />
                    </div>
                  </button>
                </footer>
              </div>
            </div>

            {/* Industrial Watermark */}
            <div className="monolith-watermark-id">{product.id}</div>
            <div className="monolith-bg-pattern"></div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
