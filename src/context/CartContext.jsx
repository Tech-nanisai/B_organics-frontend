import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === item._id);
      if (existing) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, Qty: i.Qty + 1 } : i
        );
      }
      return [...prevItems, { ...item, Qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, Qty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? { ...item, Qty: Math.max(1, Qty) }
          : item
      )
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.Qty, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartCount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
