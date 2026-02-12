import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./SearchResults.css";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});

  const { addToCart } = useCart();
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      // scroll to top on new search
      window.scrollTo(0, 0);

      if (!query) return;

      setLoading(true);
      setNotFound(false); // Reset not found state before fetch
      try {
        const res = await fetch(`https://b-organics-backend.onrender.com/api/search?query=${query}`);
        const data = await res.json();

        if (res.ok && data.length > 0) {
          setResults(data);
          setNotFound(false);
        } else {
          setResults([]);
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching search results", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
  };

  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  return (
    <div className="SearchResults-container">
      <div className="SearchResults-header">
        <h2 className="SearchResults-title">
          Search Results for "<span>{query}</span>"
        </h2>
      </div>

      {loading && (
        <div className="SearchResults-loading">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Finding the best organic products for you...</p>
        </div>
      )}

      {!loading && notFound && (
        <div className="SearchResults-notFound">
          <i className="fa-solid fa-leaf"></i>
          <p>We couldn't find any products matching "{query}".</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--SearchResults-text-muted)' }}>Try searching for generic terms like "Honey" or "Coffee".</p>
        </div>
      )}

      {!loading && !notFound && (
        <div
          className={`SearchResults-grid ${results.length === 1 ? "single" : ""
            }`}
        >
          {results.map((product) => {
            // Calculate final price logic can be inline for simplicity if not complex
            const finalPrice = product.discount
              ? calculateDiscountedPrice(product.price, product.discount)
              : product.price;

            return (
              <div key={product._id} className="SearchResults-card">
                <div className="SearchResults-imageWrapper">
                  {product.discount > 0 && (
                    <span className="SearchResults-badge">{product.discount}% OFF</span>
                  )}
                  <img src={product.image} alt={product.name} className="SearchResults-image" />
                </div>

                <div className="SearchResults-content">
                  <h3 className="SearchResults-name" title={product.name}>{product.name}</h3>

                  <div className="SearchResults-priceWrapper">
                    <span className="SearchResults-price">₹{finalPrice}</span>
                    {product.discount > 0 && (
                      <>
                        <span className="SearchResults-originalPrice">₹{product.price}</span>
                        {/* <span className="SearchResults-discount">Save {product.discount}%</span> */}
                      </>
                    )}
                  </div>

                  <div className="SearchResults-actions">
                    {!addedToCart[product._id] ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="SearchResults-btn"
                      >
                        <i className="fa-solid fa-cart-shopping"></i> Add to Cart
                      </button>
                    ) : (
                      <div className="SearchResults-added">
                        <i className="fa-solid fa-check"></i> Added
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
