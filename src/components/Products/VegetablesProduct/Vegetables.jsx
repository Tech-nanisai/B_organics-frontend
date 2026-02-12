import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { FaCartPlus, FaCheck, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Vegetables.css";

const Vegetables = () => {
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
    fetch("https://b-organics-backend.onrender.com/api/products/category/vegetables")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching vegetables:", err))
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
    <div className="Vegetables-container">
      <header className="Vegetables-header" data-aos="fade-down">
        <h2 className="Vegetables-title">Farm Fresh <br /> Pure Harvest</h2>
        <p className="Vegetables-subtitle">
          Organically grown produce harvested at peak nutritional value.
          Zero Pesticides. Verified Sustainable. Nutrient Dense.
        </p>
      </header>

      {loading ? (
        <div className="Vegetables-loading">
          <div className="Vegetables-spinner"></div>
          <p>SYNCHRONIZING CATALOGUE...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="Vegetables-noData">
          <p>NO COLLECTIONS FOUND IN CURRENT ARCHIVE.</p>
        </div>
      ) : (
        <>
          <div className="Vegetables-grid">
            {currentProducts.map((product, index) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
              const isAdded = addedToCart[product._id];

              return (
                <div
                  key={product._id}
                  className="Vegetables-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="Vegetables-imageWrapper">
                    {product.discount > 0 && (
                      <span className="Vegetables-badge">-{product.discount}%</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="Vegetables-image"
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>

                  <div className="Vegetables-details">
                    <div className="Vegetables-category-meta">
                      EARTH GRADE / {product.category}
                    </div>

                    <div className="Vegetables-card-content-row">
                      <div className="Vegetables-card-col-info">
                        <h3
                          className="Vegetables-name"
                          onClick={() => navigate(`/product-details/${product._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {product.name}
                        </h3>
                        <span className="Vegetables-quantity">{product.quantity || "1.0KG NET WT"}</span>
                      </div>

                      <div className="Vegetables-card-col-price">
                        <div className="Vegetables-price-container">
                          {product.discount > 0 && (
                            <span className="Vegetables-originalPrice">INR {product.price}</span>
                          )}
                          <span className="Vegetables-price">₹{discountedPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="Vegetables-actions">
                      {isAdded ? (
                        <div className="Vegetables-added">
                          <FaCheck /> SECURED
                        </div>
                      ) : (
                        <button
                          className="Vegetables-btn"
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

          <div className="Vegetables-pagination" data-aos="fade-up">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="Vegetables-pageBtn"
            >
              <FaChevronLeft /> Prev
            </button>
            <span className="Vegetables-pageInfo">
              {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="Vegetables-pageBtn"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Vegetables;
