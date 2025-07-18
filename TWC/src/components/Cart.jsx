import React, { useState,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import toast from 'react-hot-toast';
import "./Cart.css";
import { useCart } from "../context/cartContext"; // adjust path as needed

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    fetchCart,
    addToCart,
  } = useCart();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductImages, setCurrentProductImages] = useState([]);

  const handleQuantityChange = async (index, newQuantity) => {
    const item = cartItems[index];
    if (newQuantity === 0) {
      await removeFromCart(item.product._id, item.quantity);
      return;
    }    
    const diff = newQuantity - item.quantity;
    if (diff > 0) {
      await addToCart(item.product._id, diff);
    } else {
      await removeFromCart(item.product._id, -diff);
    }
  };
  
  const removeItem = (index) => {
    setItemToRemove(index);
    setShowConfirmation(true);
  };

  const confirmRemove = async () => {
    const item = cartItems[itemToRemove];
    await removeFromCart(item.product._id, item.quantity);
    toast.success(`${item.product.name} removed from cart`);
    setShowConfirmation(false);
  };  

  const handleProceedToPayment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to proceed!");
      navigate("/login");
    } else {
      toast.success("Your cart is ready for checkout!");
      setTimeout(() => navigate("/checkout"), 1000);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const deliveryFee = cartItems.length > 0 ? 1000 : 0;

  const openModal = (images) => {
    setCurrentProductImages(images);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProductImages([]);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="cart-container">
      <p className="shopping-bag-title">Shopping Bag</p>
      <div className="wishlist-cart-header">
        <button className="wishlist-button" onClick={() => navigate("/wishlist")}>
          <FaHeart className="wishlist-icon" />
          <span className="wishlist-text">Wishlist</span>
        </button>
        <p className="cart-count">Cart ({cartItems.length} items)</p>
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <CartItem
              key={item._id}
              item={item}
              index={index}
              onRemove={removeItem}
              onQuantityChange={handleQuantityChange}
              onImageClick={() => openModal([item.product.image])}
            />
          ))}

          <div className="order-details">
            <p>Order Details</p>
            <p>Bag Total: ₹{totalPrice}</p>
            <p>Bag Savings: ₹0</p>
            <p>Delivery Fee: ₹{deliveryFee}</p>
            <p>
              <strong>Amount Payable: ₹{totalPrice + deliveryFee}</strong>
            </p>
            <button className="proceed-button" onClick={handleProceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <p>
            Are you sure you want to remove{" "}
            {cartItems[itemToRemove]?.product.name}?
          </p>
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
          <button onClick={confirmRemove}>Remove</button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              ×
            </button>
            <Slider {...sliderSettings}>
              {currentProductImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="modal-image"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

const CartItem = ({ item, index, onRemove, onQuantityChange, onImageClick }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-image" onClick={onImageClick}>
        <img src={item.product.image} alt={item.product.name} />
      </div>
      <div className="cart-item-details">
        <h3>{item.product.name}</h3>
        <h3>Quntity:{item.quantity}</h3>
        <p>Price:</p>
        <p className="cart-item-price">
          ₹{item.product.price * item.quantity}
        </p>

        <button className="remove-button" onClick={() => onRemove(index)}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default Cart;
