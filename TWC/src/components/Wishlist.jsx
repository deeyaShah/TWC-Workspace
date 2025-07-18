import React, { useState, useEffect } from 'react';
import './Wishlist.css';
import Slider from 'react-slick';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentProductImages, setCurrentProductImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        toast.error("Failed to load wishlist.");
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = (id) => setConfirmRemoveId(id);

  const handleRemovePermanently = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(prev => prev.filter(item => item._id !== productId));
      setConfirmRemoveId(null);
      toast.success("Item removed from wishlist.");
    } catch (err) {
      console.error("Failed to remove product:", err);
      toast.error("Failed to remove product from wishlist.");
    }
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const product = wishlist.find(item => item._id === productId);

    if (!product) {
      toast.error("Product not found in wishlist.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        productId,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`${product.name} added to your cart!`);
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add to cart.");
    }
  };

  const handleCancel = () => setConfirmRemoveId(null);
  const openImageModal = (images) => {
    setCurrentProductImages(images);
    setShowImageModal(true);
  };
  const closeImageModal = () => setShowImageModal(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Wishlist</h1>
        <button className="bag-button" onClick={() => navigate('/cart')}>👜 Bag</button>
      </div>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="grid">
          {wishlist.map(item => (
            <div key={item._id} className="card">
              <img
                src={item.images[0]}
                alt={item.name}
                onClick={() => openImageModal(item.images)}
                className="product-image"
              />
              <h3>{item.name}</h3>
              <p>₹{item.price.toFixed(2)}</p>
              <div className="button-container">
                <button className="remove-button" onClick={() => handleRemove(item._id)}>🗑️ Remove</button>
                <button className="add-to-cart-button" onClick={() => handleAddToCart(item._id)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmRemoveId && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to remove this item?</p>
          <button onClick={() => handleRemovePermanently(confirmRemoveId)}>Remove Permanently</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}

      {showImageModal && (
        <div className="modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeImageModal}>&times;</span>
            <Slider {...settings}>
              {currentProductImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Product ${index + 1}`} className="modal-image" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
