import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { FaShoppingBag, FaHeart } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDetail.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import toast from 'react-hot-toast';
import { useCart } from '../context/cartContext'; // adjust path if needed

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/product/${productId}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        toast.error('Error loading product details');
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
    
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
      } catch (error) {
        toast.error('Could not load reviews');
        setReviews([]);
      }
    };
  
    fetchProductDetails();
    fetchReviews();
  }, [productId]);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }
  
    if (parseInt(quantity) > product.stock) {
      toast.error(`Only ${product.stock} item(s) left in stock`);
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId: product._id, quantity: parseInt(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success('Product added to cart!');
  
      // ✅ Update stock immediately after adding to cart
      setProduct((prev) => ({
        ...prev,
        stock: prev.stock - parseInt(quantity),
      }));
  
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding to cart');
    }
  };
  
  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error('Please login to use wishlist');
      return;
    }
  
    try {
      await axios.post("http://localhost:5000/api/wishlist/add", {
        productId: product._id, // assuming you have `product` object here
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      toast.success('Product added to wishlist!');
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container">
    <div className="product">
      <header className="product-header">
        <p className="product-name">{product.name}</p>
        <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
        <FaShoppingBag className="cart-icon" />
          {cartItems.length > 0 && (
            <span className="cart-count-badge">{cartItems.length}</span>
          )}
        </div>
      </header>

      <Slider {...settings}>
        {product.images?.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Product Image ${index}`}
              className="product-image"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>
        ))}
      </Slider>

      <div className="product-info">
        <p className="product-title">{product.description || 'Modern Modular Design for Elegant Spaces'}</p>
        <p className="product-price">Price: ₹{product.price?.toFixed(2)}</p>
        <div className="product-reviews">
          <span className="star-rating">⭐ {product.reviews || 4.5} / 5</span>
        </div>

        {/* Stock Info */}
        <div className="product-stock-info">
          {product.stock === 1 && (
            <span className="stock-warning">Only 1 left in stock!</span>
          )}
          {product.stock <= 0 && (
            <span className="stock-out">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Quantity Dropdown - only if product is in stock */}
      {product.stock > 0 && (
        <div className="dropdown">
          <label htmlFor="quantity">Select Quantity:</label>
          <div className="select-wrapper">
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {Array.from({ length: product.stock >= 5 ? 5 : product.stock }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        )}


      <p>Product Review</p>

      <div className="dropdown">
        <button className="dropdown-button">Reviews and Ratings</button>
        <div className="dropdown-content">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews
              .filter((review) => review.status === 'approved')
              .map((review) => (
                <div key={review._id} className="review-box">
                  <p><strong>Reviewed by:</strong> {review.user?.username || 'Anonymous'}</p>
                  <p><strong>Rating:</strong> ⭐ {review.rating}</p>
                  <p>{review.comment}</p>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    {/* {new Date(review.createdAt).toLocaleString()} */}
                  </p>
                  <hr />
                </div>
              ))
          )}
        </div>
      </div>

      <div className="button-container-new">
        <button onClick={handleAddToWishlist} className="wishlist-button">
            ❤️ Add to Wishlist
        </button>

        <button
          className="add-to-cart"
          disabled={product.stock === 0 || parseInt(quantity) > product.stock}
          onClick={handleAddToCart}
          style={{
            backgroundColor: product.stock === 0 ? '#ccc' : '#28a745',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <FaShoppingBag /> {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
        </button>

      </div>
    </div>
    </div>
  );
};

export default ProductDetail;
