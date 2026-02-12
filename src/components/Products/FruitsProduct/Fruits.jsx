import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { FaCartPlus, FaCheck, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Fruits.css";

const Fruits = () => {
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
    fetch("http://localhost:5678/api/products/category/fruits")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching fruits:", err))
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
    <div className="Fruits-container">
      <header className="Fruits-header" data-aos="fade-down">
        <h2 className="Fruits-title">Seasonal Organic <br /> Pure Fruits</h2>
        <p className="Fruits-subtitle">
          Hand-selected premium fruits ripened naturally in direct sunlight.
          Zero Synthetics. Certified Organic. Nutrient Prime.
        </p>
      </header>

      {loading ? (
        <div className="Fruits-loading">
          <div className="Fruits-spinner"></div>
          <p>SYNCHRONIZING CATALOGUE...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="Fruits-noData">
          <p>NO COLLECTIONS FOUND IN CURRENT ARCHIVE.</p>
        </div>
      ) : (
        <>
          <div className="Fruits-grid">
            {currentProducts.map((product, index) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
              const isAdded = addedToCart[product._id];

              return (
                <div
                  key={product._id}
                  className="Fruits-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="Fruits-imageWrapper">
                    {product.discount > 0 && (
                      <span className="Fruits-badge">-{product.discount}%</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="Fruits-image"
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>

                  <div className="Fruits-details">
                    <div className="Fruits-category-meta">
                      ORCHARD GRADE / {product.category}
                    </div>

                    <div className="Fruits-card-content-row">
                      <div className="Fruits-card-col-info">
                        <h3
                          className="Fruits-name"
                          onClick={() => navigate(`/product-details/${product._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {product.name}
                        </h3>
                        <span className="Fruits-quantity">{product.quantity || "1.0KG NET WT"}</span>
                      </div>

                      <div className="Fruits-card-col-price">
                        <div className="Fruits-price-container">
                          {product.discount > 0 && (
                            <span className="Fruits-originalPrice">INR {product.price}</span>
                          )}
                          <span className="Fruits-price">₹{discountedPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="Fruits-actions">
                      {isAdded ? (
                        <div className="Fruits-added">
                          <FaCheck /> SECURED
                        </div>
                      ) : (
                        <button
                          className="Fruits-btn"
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

          <div className="Fruits-pagination" data-aos="fade-up">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="Fruits-pageBtn"
            >
              <FaChevronLeft /> Prev
            </button>
            <span className="Fruits-pageInfo">
              {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="Fruits-pageBtn"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Fruits;
