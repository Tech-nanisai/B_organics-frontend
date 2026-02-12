import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./../../context/CartContext";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Allproducts.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const [addedToCart, setAddedToCart] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
    fetch("http://localhost:5678/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching all products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product._id]: false }));
    }, 3000);
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatPrice = (price) => {
    const rupees = Math.floor(price);
    const paise = (price % 1).toFixed(2).split(".")[1];
    return (
      <>
        ₹{rupees}<sup>{paise}</sup>
      </>
    );
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return Math.round(price - (price * discount) / 100);
  };

  if (loading) {
    return (
      <div className="Allproducts-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="Honey-spinner"></div>
          <p style={{ fontFamily: 'Space Mono', letterSpacing: '2px', color: '#888' }}>MASTER CATALOGUE SYNCING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Allproducts-container">
      <header data-aos="fade-down">
        <h2 className="Allproducts-heading">Master Collection</h2>
        <p className="Allproducts-count">
          {products.length} ENTRIES REGISTERED IN ARCHIVE
        </p>
      </header>

      <div className="Allproducts-grid">
        {currentProducts.map((product, index) => {
          const discounted = calculateDiscountedPrice(product.price, product.discount);
          const isAdded = addedToCart[product._id];

          return (
            <div
              key={product._id}
              className="Allproducts-card"
              data-aos="fade-up"
              data-aos-delay={index % 4 * 100}
            >
              <div style={{ overflow: 'hidden', position: 'relative' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="Allproducts-image"
                  onClick={() => navigate(`/product-details/${product._id}`)}
                  style={{ cursor: "pointer" }}
                />
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: '#000',
                    color: '#fff',
                    padding: '5px 10px',
                    fontSize: '0.6rem',
                    fontWeight: '900',
                    letterSpacing: '1px'
                  }}>-{product.discount}%</div>
                )}
              </div>

              <div className="Allproducts-details">
                <div className="Allproducts-card-content-row">
                  <div className="Allproducts-card-col-info">
                    <div className="Allproducts-category-meta">
                      {product.category || 'GENERAL'} / SERIAL: {product._id.slice(-6).toUpperCase()}
                    </div>
                    <h3
                      className="Allproducts-name"
                      onClick={() => navigate(`/product-details/${product._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="Allproducts-card-col-price">
                    <p className="Allproducts-price">{formatPrice(discounted)}</p>
                  </div>
                </div>

                <div className="Allproducts-actions-container">
                  <div className="Allproducts-actions">
                    {isAdded ? (
                      <div className="added-message">
                        <FaCheck /> SECURED
                      </div>
                    ) : (
                      <button
                        className="Allproducts-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart <FaArrowRight style={{ marginLeft: '10px' }} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="Allproducts-pagination" data-aos="fade-up">
        <button
          className="Allproducts-pageBtn"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="Allproducts-pageInfo">
          {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
        </span>

        <button
          className="Allproducts-pageBtn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
