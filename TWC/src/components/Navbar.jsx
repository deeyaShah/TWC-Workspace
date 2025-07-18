import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import toast from 'react-hot-toast';
import UserMenu from './UserMenu';
import { useCart } from '../context/cartContext'; // ✅ Import your context hook
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems } = useCart(); // ✅ Access cart items

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchVisible(false);
        setSearchText('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      navigate(`/search?name=${encodeURIComponent(searchText.trim())}`);
      setSearchVisible(false);
      setSearchText('');
      toast.success('Search executed successfully!');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav>
  <div className="navbar-container">
    {/* Logo */}
    <div className="flex items-center logo">
      <img src="/images/Logo_transparent.png" alt="Company Logo" className="h-8 mr-2" />
    </div>

    {/* Nav Links (Desktop only) */}
    <div className={`flex space-x-4 nav-links ${isOpen ? 'open' : ''}`}>
      <Link to="/" className="relative text-white group" onClick={toggleMenu}>
        Home<span className="absolute underline-height"></span>
      </Link>
      <Link to="/about" className="relative text-white group" onClick={toggleMenu}>
        About Us<span className="absolute underline-height"></span>
      </Link>
      <Link to="/contact" className="relative text-white group" onClick={toggleMenu}>
        Contact Us<span className="absolute underline-height"></span>
      </Link>
      <Link to="/blogs" className="relative text-white group" onClick={toggleMenu}>
        Blog<span className="absolute underline-height"></span>
      </Link>
    </div>

    {/* Right Icons (Search, Cart, User, Menu button) */}
    <div className="mobile-actions">
      <div className="search-container" ref={searchRef}>
        <FaSearch
          className="search-icon"
          onClick={() => {
            if (searchVisible && searchText.trim()) {
              handleSearch();
            } else {
              setSearchVisible(!searchVisible);
            }
          }}
        />
        <input
          type="text"
          placeholder="Search..."
          className={`search-input ${searchVisible ? 'visible' : ''}`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Link to="/cart" className="bag-icon relative">
        <FiShoppingBag size={24} color="white" />
        {cartItems.length > 0 && (
          <span className="cart-count-badge">{cartItems.length}</span>
        )}
      </Link>

      <UserMenu />

      <button className="menu-toggle" onClick={toggleMenu}>☰</button>
    </div>
  </div>
</nav>
  );
};

export default Navbar;