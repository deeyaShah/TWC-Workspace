// CartContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error('Error fetching cart', err);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
     fetchCart(); /// update cart state
    } catch (err) {
      console.error('Error adding to cart', err);
    }
  };

  const removeFromCart = async (productId, quantity) => {
    try {
      await axios.post(
        'http://localhost:5000/api/cart/remove',
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchCart();  // update cart state
    } catch (err) {
      console.error('Error removing from cart', err);
    }
  };
  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCartItems([]); // clear cart in context
    } catch (err) {
      console.error('Error clearing cart', err);
    }
  };
  
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,clearCart ,fetchCart}}>
      {children}
    </CartContext.Provider>
  );
};
