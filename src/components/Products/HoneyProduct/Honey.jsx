import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { FaCartPlus, FaCheck, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Honey.css";

const Honey = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [addedToCart, setAddedToCart] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
    fetch("https://b-organics-backend.onrender.com/api/products/category/honey")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching honey:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product._id]: false }));
    }, 3000);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return Math.round(price - (price * discount) / 100);
  };

  return (
    <div className="Honey-container">
      <header className="Honey-header" data-aos="fade-down">
        <h2 className="Honey-title">Pure Organic <br /> Wild Honey</h2>
        <p className="Honey-subtitle">
          Artisanal nectar ethically sourced from certified organic reserves.
          Bio-active. Traceable. Pure.
        </p>
      </header>

      {loading ? (
        <div className="Honey-loading">
          <div className="Honey-spinner"></div>
          <p>SYNCHRONIZING CATALOGUE...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="Honey-noData">
          <p>NO COLLECTIONS FOUND IN CURRENT ARCHIVE.</p>
        </div>
      ) : (
        <>
          <div className="Honey-grid">
            {currentProducts.map((product, index) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
              const isAdded = addedToCart[product._id];

              return (
                <div
                  key={product._id}
                  className="Honey-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="Honey-imageWrapper">
                    {product.discount > 0 && (
                      <span className="Honey-badge">-{product.discount}%</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="Honey-image"
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>

                  <div className="Honey-details">
                    <div className="Honey-category-meta">
                      PREMIUM GRADE / {product.category}
                    </div>

                    <div className="Honey-card-content-row">
                      <div className="Honey-card-col-info">
                        <h3
                          className="Honey-name"
                          onClick={() => navigate(`/product-details/${product._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {product.name}
                        </h3>
                        <span className="Honey-quantity">{product.quantity || "500G NET WT"}</span>
                      </div>

                      <div className="Honey-card-col-price">
                        <div className="Honey-price-container">
                          {product.discount > 0 && (
                            <span className="Honey-originalPrice">INR {product.price}</span>
                          )}
                          <span className="Honey-price">₹{discountedPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="Honey-actions">
                      {isAdded ? (
                        <div className="Honey-added">
                          <FaCheck /> SECURED
                        </div>
                      ) : (
                        <button
                          className="Honey-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add To Cart <FaArrowRight />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="Honey-pagination" data-aos="fade-up">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="Honey-pageBtn"
            >
              <FaChevronLeft /> Prev
            </button>
            <span className="Honey-pageInfo">
              {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="Honey-pageBtn"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Honey;
