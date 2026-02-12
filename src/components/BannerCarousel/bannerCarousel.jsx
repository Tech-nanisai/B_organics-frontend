import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaMagic } from "react-icons/fa";
import "./bannerCarousel.css";

const slides = [
  {
    title: "Artisanal Coffee Rituals.",
    subtitle: "Slow-roasted, high-altitude beans that deliver a sophisticated profile for the discerning palate.",
    bgImage: "https://res.cloudinary.com/dexueorjm/image/upload/v1770351720/Coffee-1_yqki0h.jpg",
    fgImage: "https://res.cloudinary.com/dexueorjm/image/upload/v1770359570/coffee-fgimage_cbqa0t.png",
    accent: "#a855f7",
    buttonText: "View Collection",
    path: "/coffee",
    badge: "Global Reserve",
    isLarge: true
  },
  {
    title: "Organic Harvest Spices.",
    subtitle: "Pure, aromatic spices sourced from the world's most pristine organic gardens to elevate your culinary experience.",
    bgImage: "https://res.cloudinary.com/dexueorjm/image/upload/v1770351050/VEG-2_grlgfe.jpg",
    fgImage: "https://res.cloudinary.com/dexueorjm/image/upload/v1770359568/vegitable-fgimage_t8zook.png",
    accent: "#6cbd45",
    buttonText: "Shop Spices",
    path: "/all-products",
    badge: "Premium Selection"
  },
  {
    title: "Organic Fruit Harvest.",
    subtitle: "Hand-picked organic fruits delivered fresh from our orchards to your table with maximum nutritional value.",
    bgImage: "https://res.cloudinary.com/dexueorjm/image/upload/v1770351705/Fruits-1.1_jycdke.jpg",
    fgImage: "https://res.cloudinary.com/dexueorjm/image/upload/v1770359572/fruts-fgimage_clxpri.png",
    accent: "#3b82f6",
    buttonText: "Explore More",
    path: "/all-products",
    badge: "Active Wear"
  }
];

const BannerCarousel = () => {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [direction, setDirection] = useState("next");
  const navigate = useNavigate();

  const handleNext = useCallback(() => {
    setDirection("next");
    setIsFading(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setIsFading(false);
    }, 600);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection("prev");
    setIsFading(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsFading(false);
    }, 600);
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const currentSlide = slides[index];

  return (
    <section className="Banner-carousel-root">
      <div className={`Banner-viewport ${isFading ? `is-transitioning ${direction}` : ''}`}>

        {/* Abstract Background Layers */}
        <div className="Banner-bg-layer" style={{ backgroundImage: `url(${currentSlide.bgImage})` }}></div>
        <div className="Banner-glass-overlay"></div>
        <div className="Banner-accent-glow" style={{ background: currentSlide.accent }}></div>

        <div className="Banner-container">
          <div className="Banner-main-content">

            <div className="Banner-text-stack">
              <div className="Banner-badge-wrapper" data-aos="fade-down">
                <span className="Banner-pill" style={{ borderColor: currentSlide.accent }}>
                  <FaMagic style={{ color: currentSlide.accent }} /> {currentSlide.badge}
                </span>
              </div>

              <h1 className="Banner-headline" data-aos="reveal-text">
                {currentSlide.title.split(' ').map((word, i) => (
                  <span key={i} className="word-fade">{word} </span>
                ))}
              </h1>

              <p className="Banner-description" data-aos="fade-up" data-aos-delay="200">
                {currentSlide.subtitle}
              </p>

              <div className="Banner-actions" data-aos="fade-up" data-aos-delay="400">
                <button
                  className="Banner-primary-btn"
                  style={{ '--btn-accent': currentSlide.accent }}
                  onClick={() => navigate(currentSlide.path)}
                >
                  <span className="btn-text">{currentSlide.buttonText}</span>
                  <div className="btn-icon">
                    <FaArrowRight />
                  </div>
                </button>
              </div>
            </div>

            <div className="Banner-hero-visual" data-aos="zoom-out">
              <div className={`Banner-image-frame ${currentSlide.isLarge ? 'is-large' : ''}`}>
                <img src={currentSlide.fgImage} alt={currentSlide.title} className="Banner-main-img" />
                <div className="image-depth-shadow"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Controls Navigation */}
        <div className="Banner-nav-interface">
          <div className="nav-group">
            <button className="nav-arrow prev" onClick={handlePrev}>
              <FaChevronLeft />
            </button>

            <div className="nav-pagination">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`nav-dot ${i === index ? 'is-active' : ''}`}
                  onClick={() => {
                    if (i === index) return;
                    setDirection(i > index ? "next" : "prev");
                    setIsFading(true);
                    setTimeout(() => {
                      setIndex(i);
                      setIsFading(false);
                    }, 600);
                  }}
                >
                  <span className="dot-label">0{i + 1}</span>
                </button>
              ))}
            </div>

            <button className="nav-arrow next" onClick={handleNext}>
              <FaChevronRight />
            </button>
          </div>

          <div className="nav-index-indicator">
            <span className="current">0{index + 1}</span>
            <span className="separator">/</span>
            <span className="total">0{slides.length}</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BannerCarousel;
