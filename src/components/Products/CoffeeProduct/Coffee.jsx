import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { FaCartPlus, FaCheck, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Coffee.css";

const Coffee = () => {
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
    fetch("http://localhost:5678/api/products/category/coffee")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching coffee:", err))
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
    <div className="Coffee-container">
      <header className="Coffee-header" data-aos="fade-down">
        <h2 className="Coffee-title">Artisan Coffee <br /> Hand-Roasted</h2>
        <p className="Coffee-subtitle">
          Exquisite single-origin beans sourced from high-altitude estates.
          Roasted in small batches. Sustainable. Intense.
        </p>
      </header>

      {loading ? (
        <div className="Coffee-loading">
          <div className="Coffee-spinner"></div>
          <p>SYNCHRONIZING CATALOGUE...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="Coffee-noData">
          <p>NO COLLECTIONS FOUND IN CURRENT ARCHIVE.</p>
        </div>
      ) : (
        <>
          <div className="Coffee-grid">
            {currentProducts.map((product, index) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
              const isAdded = addedToCart[product._id];

              return (
                <div
                  key={product._id}
                  className="Coffee-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="Coffee-imageWrapper">
                    {product.discount > 0 && (
                      <span className="Coffee-badge">-{product.discount}%</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="Coffee-image"
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>

                  <div className="Coffee-details">
                    <div className="Coffee-category-meta">
                      ESTATE GRADE / {product.category}
                    </div>

                    <div className="Coffee-card-content-row">
                      <div className="Coffee-card-col-info">
                        <h3
                          className="Coffee-name"
                          onClick={() => navigate(`/product-details/${product._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {product.name}
                        </h3>
                        <span className="Coffee-quantity">{product.quantity || "250G NET WT"}</span>
                      </div>

                      <div className="Coffee-card-col-price">
                        <div className="Coffee-price-container">
                          {product.discount > 0 && (
                            <span className="Coffee-originalPrice">INR {product.price}</span>
                          )}
                          <span className="Coffee-price">₹{discountedPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="Coffee-actions">
                      {isAdded ? (
                        <div className="Coffee-added">
                          <FaCheck /> SECURED
                        </div>
                      ) : (
                        <button
                          className="Coffee-btn"
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

          <div className="Coffee-pagination" data-aos="fade-up">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="Coffee-pageBtn"
            >
              <FaChevronLeft /> Prev
            </button>
            <span className="Coffee-pageInfo">
              {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="Coffee-pageBtn"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Coffee;
