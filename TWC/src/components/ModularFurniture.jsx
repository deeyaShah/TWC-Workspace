import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import './ModularFurniture.css';

const ModularFurniture = () => {
  const navigate = useNavigate();
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedRating, setSelectedRating] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://twc-workspace.onrender.com/api/products/products');
        const data = await response.json();
        setProducts(data.products || data || []);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = async (event) => {
    const value = event.target.value;
    const newCategories = selectedCategories.includes(value)
      ? selectedCategories.filter(category => category !== value)
      : [...selectedCategories, value];
    
    setSelectedCategories(newCategories);

    if (newCategories.length > 0) {
      try {
        setLoading(true);
        const response = await fetch(`https://twc-workspace.onrender.com/api/products/subcategory-details/${value}`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to filter products');
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await fetch('https://twc-workspace.onrender.com/api/products/products');
        const data = await response.json();
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to filter products');
        setLoading(false);
      }
    }
  };

  const handlePriceRangeChange = (event) => {
    const value = event.target.value;
    setSelectedPriceRange(prev =>
      prev.includes(value)
        ? prev.filter(range => range !== value)
        : [...prev, value]
    );
  };

  const handleRatingChange = () => {
    setSelectedRating(!selectedRating);
  };

  const filterProducts = () => {
    return products.filter(product => {
      const price = parseFloat(product.price);
      const inPriceRange =
        selectedPriceRange.length === 0 ||
        (selectedPriceRange.includes('50000-60000') && price >= 50000 && price <= 60000) ||
        (selectedPriceRange.includes('60000-70000') && price > 60000 && price <= 70000) ||
        (selectedPriceRange.includes('70000-80000') && price > 70000 && price <= 80000);
      const inRating = !selectedRating || product.rating >= 4.5;

      return inPriceRange && inRating;
    });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <div className="rating">
        {'⭐'.repeat(fullStars)}
        {halfStars ? '⭐️' : ''}
        {'☆'.repeat(emptyStars)}
        <span className="rating-value"> ({rating})</span>
      </div>
    );
  };

  const toggleCustomization = () => {
    setShowCustomization(!showCustomization);
  };

  const handleProductClick = (productId) => {
    navigate(`/productDetails/${productId}`);
  };

  // ✅ Add to Cart functionality
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Please login first');
  
    if (product.stock === 0) {
      return toast.error('This product is out of stock');
    }
  
    try {
      const res = await fetch(`https://twc-workspace.onrender.com/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add to cart');
  
      toast.success('Product added to cart!');
  
      // ✅ Decrease stock count in UI
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p._id === product._id ? { ...p, stock: p.stock - 1 } : p
        )
      );
    } catch (error) {
      toast.error(error.message || 'Error adding to cart');
    }
  };
  

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="modular-furniture">
      <div className="hero-image">
        <div className="overlay">
          <h1>GIVE LIFE FOR YOUR DREAM HOME<br />
            <h3>Discover your modern living</h3>
          </h1>
        </div>
      </div>

      <button className="customize-button" onClick={toggleCustomization}>
        Customize your search <span role="img" aria-label="filter">🔍</span>
      </button>

      {showCustomization && (
        <div className="customization-container">
          {/* <h2>Customize Your Search</h2>
          <div>
            <h3>Categories:</h3>
            {['Sofa', 'Dining Table', 'Wardrobe', 'Coffee Table', 'Bookshelf', 'TV Unit', 'Crockery Unit'].map(item => (
              <label key={item}>
                <input type="checkbox" value={item} onChange={handleCategoryChange} />
                {item}
              </label>
            ))}
          </div> */}

          <div>
            <h3>Price Range:</h3>
            {['50000-60000', '60000-70000', '70000-80000'].map(range => (
              <label key={range}>
                <input type="checkbox" value={range} onChange={handlePriceRangeChange} />
                ₹{range.replace('-', ' - ₹')}
              </label>
            ))}
          </div>

          <div>
            <h3>Rating:</h3>
            {[3.0, 4.0, 4.5].map(rating => (
              <label key={rating}>
                <input type="checkbox" onChange={handleRatingChange} />
                {rating} and above
              </label>
            ))}
          </div>
        </div>
      )}

<div className="product-container">
        {filterProducts().map(product => (
          <div
            key={product._id}
            className={`product-card ${product.stock === 0 ? 'out-of-stock-card' : ''}`}
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={product.images && product.images[0]}
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            {renderStars(product.rating)}
            <p className="product-price">₹{product.price.toLocaleString()}</p>

            {/* Stock indicator */}
            {product.stock === 0 && (
              <p className="out-of-stock-label">Out of Stock</p>
            )}
            {product.stock === 1 && (
              <p className="low-stock-label">Only 1 left!</p>
            )}

            {/* Add to Cart */}
            <button
              className="add-to-cart"
              disabled={product.stock === 0}
              onClick={(e) => handleAddToCart(e, product)}
            >
              {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModularFurniture;
