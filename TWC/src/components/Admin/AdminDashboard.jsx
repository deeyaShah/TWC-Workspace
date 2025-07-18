import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaFileAlt,
  FaConciergeBell,
  FaStar,
  FaBell,
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import logo from "/images/Logo_transparent.png";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchVisible(false);
      }
    };

    // Auto open category menu if navigating within it
    if (location.pathname.startsWith("/admin/dashboard/category")) {
      setIsCategoryOpen(true);
    } else {
      setIsCategoryOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Menu Items */}
        <ul className="menu">
          <li className={`menu-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}>
            <Link to="/admin/dashboard">
              <FaBox className="menu-icon" />
              <span>Dashboard</span>
            </Link>
          </li>

          <li className={`menu-item ${location.pathname === "/admin/dashboard/products" ? "active" : ""}`}>
            <Link to="/admin/dashboard/products">
              <FaBox className="menu-icon" />
              <span>Products</span>
            </Link>
          </li>

          <li className={`menu-item ${location.pathname === "/admin/dashboard/kitchnes" ? "active" : ""}`}>
            <Link to="/admin/dashboard/kitchnes">
              <FaBox className="menu-icon" />
              <span>Kitchen Products</span>
            </Link>
          </li>

          {/* Category Dropdown */}
          <li className="menu-item" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
            <div className="menu-item-dropdown">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaShoppingCart className="menu-icon" />
                Category
              </span>
              {isCategoryOpen ? <FaChevronDown /> : <FaChevronRight />}
            </div>
          </li>

          {isCategoryOpen && (
            <ul className="submenu-items">
              {/* <li className={location.pathname === "/admin/dashboard/category/kitchen" ? "active-submenu" : ""}>
                <Link to="/admin/dashboard/category/kitchen">Modular Kitchen</Link>
              </li> */}
              <li className={location.pathname === "/admin/dashboard/category/furniture" ? "active-submenu" : ""}>
                <Link to="/admin/dashboard/category/furniture">Modular Furniture</Link>
              </li>
            </ul>
          )}

          <li className={`menu-item ${location.pathname === "/admin/dashboard/users" ? "active" : ""}`}>
            <Link to="/admin/dashboard/users">
              <FaUsers className="menu-icon" />
              <span>Users</span>
            </Link>
          </li>

          {/* <li className={`menu-item ${location.pathname === "/admin/dashboard/user-activity" ? "active" : ""}`}>
            <Link to="/admin/dashboard/user-activity">
              <FaUsers className="menu-icon" />
              <span>User Activity</span>
            </Link>
          </li> */}

          <li className={`menu-item ${location.pathname === "/admin/dashboard/orders" ? "active" : ""}`}>
            <Link to="/admin/dashboard/orders">
              <FaShoppingCart className="menu-icon" />
              <span>Orders</span>
            </Link>
          </li>

          <li className={`menu-item ${location.pathname === "/admin/dashboard/blog" ? "active" : ""}`}>
            <Link to="/admin/dashboard/blog">
              <FaFileAlt className="menu-icon" />
              <span>Blog</span>
            </Link>
          </li>

          <li className={`menu-item ${location.pathname === "/admin/dashboard/kitchen-service" ? "active" : ""}`}>
            <Link to="/admin/dashboard/kitchen-service">
              <FaConciergeBell className="menu-icon" />
              <span>Kitchen Service</span>
            </Link>
          </li>

          <li className={`menu-item ${location.pathname === "/admin/dashboard/reviews" ? "active" : ""}`}>
            <Link to="/admin/dashboard/reviews">
              <FaStar className="menu-icon" />
              <span>Reviews</span>
            </Link>
          </li>

          <li className={`menu-item ${location.pathname === "/" ? "active" : ""}`}>
            <a href="/" className="menu-link">
              <FaHome className="menu-icon" />
              <span>Home Page</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          {/* Optional Top Bar Content */}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
