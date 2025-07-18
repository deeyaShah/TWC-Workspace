import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast'; 
import axios from 'axios';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  // === review flow state ===
  const [currentIndex, setCurrentIndex]       = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating]                   = useState(0);
  const [hoverRating, setHoverRating]         = useState(0);
  const [reviewText, setReviewText]           = useState('');

  // Open first review modal after 5s
  useEffect(() => {
    if (order?.items?.length) {
      const timer = setTimeout(() => setShowReviewModal(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [order]);

  const handleContinueShopping = () => navigate('/');
  const handleInvoiceClick     = () => navigate(`/invoice/${order._id}`);

  const handleSubmitReview = async () => {
    if (rating === 0 || reviewText.trim() === '') {
      toast.error('Please select a rating and write a review.');
      return;
    }

    const item = order.items[currentIndex];
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          order:   order._id,
          product: item.product,
          rating,
          comment: reviewText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Review for "${item.productName}" submitted!`);
    } catch (err) {
      console.error('Review submission error:', err);
      toast.error('Failed to submit review.');
      return;
    }

    // reset and move on
    setRating(0);
    setHoverRating(0);
    setReviewText('');

    if (currentIndex + 1 < order.items.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowReviewModal(false);
    }
  };

  // skip current review and move to next (or close if done)
  const handleSkipReview = () => {
    setRating(0);
    setHoverRating(0);
    setReviewText('');
    if (currentIndex + 1 < order.items.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowReviewModal(false);
    }
  };

  if (!order) {
    return (
      <div className="confirmation-container">
        <h2>No order data available.</h2>
      </div>
    );
  }

  const currentItem = order.items[currentIndex];

  return (
    <div className="confirmation-container">
            <Toaster position="top-right" reverseOrder={false} /> {/* Toast container */}
      <div className="confirmation-content">
        <FaCheckCircle size={50} color="green" />
        <h2 className="confirmation-title">Order Confirmed</h2>
        <p className="confirmation-message">
          Thank you for your purchase! Your order has been placed.
        </p>
        <p className="order-id">Order ID: #{order._id}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>

        <h4>Items:</h4>
        <ul>
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.productName} - ₹{item.price} × {item.quantity}
            </li>
          ))}
        </ul>

        <p className="invoice-link" onClick={handleInvoiceClick}>
          <span className="invoice-text">View Invoice</span>
        </p>
        <button
          className="continue-shopping-button"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </button>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h3>Review "{currentItem.productName}"</h3>

            <div className="form-group">
              <label>Your Rating:</label>
              <div className="star-rating">
                {[1,2,3,4,5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    className="star"
                    color={(hoverRating || rating) >= star ? '#ffc107' : '#e4e5e9'}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review:</label>
              <textarea
                rows="4"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Write your review here..."
              />
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={handleSkipReview}>
                Skip & Next
              </button>
              <button className="btn btn-primary" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>

            <p className="review-counter">
              {currentIndex + 1} of {order.items.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
