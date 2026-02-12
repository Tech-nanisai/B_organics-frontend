import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProductDetails.css";
import { FaShoppingCart, FaArrowRight, FaStar, FaCheck } from "react-icons/fa";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        fetch("http://localhost:5678/api/products")
            .then((res) => res.json())
            .then((data) => {
                const current = data.find((p) => p._id === id);
                setProduct(current);
                if (current) {
                    setMainImage(current.image);
                    // Filter recommended: same category significantly, exclude current
                    const related = data
                        .filter((p) => p.category === current.category && p._id !== id)
                        .slice(0, 4);
                    setRecommended(related);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    const calculatePrice = (price, discount) => {
        if (!discount) return price;
        return Math.round(price - (price * discount) / 100);
    };

    if (loading) return (
        <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h2>Loading Details...</h2>
        </div>
    );

    if (!product) return (
        <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h2>Product Not Found</h2>
        </div>
    );

    const discountPrice = calculatePrice(product.price, product.discount);

    // Use images from backend if available, otherwise fallback to main image
    const galleryImages = (product.images && product.images.length > 0)
        ? [product.image, ...product.images]
        : [product.image];

    // De-duplicate images
    const uniqueImages = [...new Set(galleryImages)].filter(Boolean);

    return (
        <div className="PD-container">
            <div className="PD-wrapper">
                {/* Gallery */}
                <div className="PD-gallery">
                    <div className="PD-main-image-frame">
                        <img src={mainImage} alt={product.name} className="PD-main-image" />
                    </div>
                    <div className="PD-thumbnails">
                        {uniqueImages.map((img, idx) => (
                            <div
                                key={idx}
                                className={`PD-thumb ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                            >
                                <img src={img} alt={`Thumb ${idx}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="PD-info">
                    <div className="PD-category">{product.category} Collection</div>
                    <h1 className="PD-title">{product.name}</h1>

                    <div className="PD-price-block">
                        <span className="PD-current-price">₹{discountPrice}</span>
                        {product.discount > 0 && (
                            <>
                                <span className="PD-original-price">₹{product.price}</span>
                                <span className="PD-discount-badge">Save {product.discount}%</span>
                            </>
                        )}
                    </div>

                    <p className="PD-description">
                        {product.description || "Experience the finest quality organic produce, sourced directly from certified farms. Pure, natural, and ethically harvested for your well-being."}
                    </p>

                    <div className="PD-actions">
                        <button id="btn-pd-add-to-cart" className="PD-btn PD-add-cart" onClick={handleAddToCart}>
                            {isAdded ? <FaCheck /> : <FaShoppingCart />}
                            {isAdded ? "Added" : "Add to Cart"}
                        </button>
                        <button id="btn-pd-buy-now" className="PD-btn PD-buy-now" onClick={() => { addToCart(product); navigate('/cart'); }}>
                            Buy Now <FaArrowRight />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', color: '#555', fontSize: '0.9rem' }}>
                        <div><FaCheck color="#15803d" /> 100% Organic</div>
                        <div><FaCheck color="#15803d" /> Sustainably Sourced</div>
                        <div><FaCheck color="#15803d" /> Premium Grade</div>
                    </div>
                </div>
            </div>

            {/* Recommended */}
            {recommended.length > 0 && (
                <div className="PD-recommended">
                    <h3 className="PD-rec-title">You May Also Like</h3>
                    <div className="PD-rec-grid">
                        {recommended.map((rec) => (
                            <div
                                key={rec._id}
                                className="PD-rec-card"
                                onClick={() => navigate(`/product-details/${rec._id}`)}
                            >
                                <img src={rec.image} alt={rec.name} className="PD-rec-image" />
                                <div className="PD-rec-name">{rec.name}</div>
                                <div className="PD-rec-price">₹{calculatePrice(rec.price, rec.discount)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
