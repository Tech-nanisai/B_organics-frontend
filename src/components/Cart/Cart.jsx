import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaShoppingBag } from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const discounted = calculateDiscountedPrice(item.price, item.discount || 0);
      return total + discounted * item.Qty;
    }, 0);
  };

  const deliveryFee = 40; // Example
  const total = getSubtotal() > 0 ? getSubtotal() + deliveryFee : 0;

  return (
    <div className="Cart-container">
      <header className="Cart-header">
        <h2 className="Cart-title">
          <FaShoppingBag className="Cart-titleIcon" /> Shopping Cart
        </h2>
        <p className="Cart-count">{cartItems.length} Items</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="Cart-empty">
          <div className="Cart-emptyIcon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/all-products" className="Cart-continueBtn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="Cart-layout">
          {/* Items List */}
          <div className="Cart-itemsList">
            {cartItems.map((item) => {
              const discountedPrice = calculateDiscountedPrice(item.price, item.discount || 0);
              return (
                <div className="Cart-itemCard" key={item._id}>
                  <div className="Cart-itemVisual">
                    <img src={item.image} alt={item.name} className="Cart-itemImage" />
                  </div>

                  <div className="Cart-itemInfo">
                    <div className="Cart-itemHeader">
                      <h3 className="Cart-itemName">{item.name}</h3>
                      <p className="Cart-itemMeta">{item.quantity} {item.unit}</p>
                    </div>

                    <div className="Cart-itemPriceBlock">
                      <span className="Cart-currentPrice">₹{discountedPrice}</span>
                      {item.discount > 0 && (
                        <span className="Cart-oldPrice">₹{item.price}</span>
                      )}
                    </div>

                    <div className="Cart-itemActions">
                      <div className="Cart-qtySelector">
                        <button
                          className="Cart-qtyBtn"
                          onClick={() => updateQuantity(item._id, item.Qty - 1)}
                          disabled={item.Qty <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="Cart-qtyValue">{item.Qty}</span>
                        <button
                          className="Cart-qtyBtn"
                          onClick={() => updateQuantity(item._id, item.Qty + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        className="Cart-removeBtn"
                        onClick={() => removeFromCart(item._id)}
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="Cart-itemTotal">
                    ₹{discountedPrice * item.Qty}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <aside className="Cart-summary">
            <h3 className="Cart-summaryTitle">Order Summary</h3>
            <div className="Cart-summaryRow">
              <span>Subtotal</span>
              <span>₹{getSubtotal()}</span>
            </div>
            <div className="Cart-summaryRow">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="Cart-summaryRow Cart-totalRow">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button id="btn-cart-checkout" className="Cart-checkoutBtn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout <FaArrowRight />
            </button>
            <p className="Cart-secureNote">🛡️ Secure 256-bit encrypted checkout</p>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
