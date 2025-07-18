import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiLogIn,
  FiLogOut,
  FiHeart,
  FiX,
  FiMapPin,
  FiShield,
  FiClock,
} from "react-icons/fi";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userDetails, setUserDetails] = useState(() =>
    JSON.parse(localStorage.getItem("userDetails"))
  );
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    setIsAuthenticated(storedAuth);
    setUserDetails(storedUser);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    setIsAuthenticated(false);
    setUserDetails(null);
    setShowLogoutPopup(false);
    setMenuOpen(false);
    toast.success("Logged out successfully"); // ✅ Toast here
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FiUser className="h-8 w-8 text-white hover:text-gray-300 transition-all" />
      </motion.div>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: menuOpen ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[370px] z-50 overflow-y-auto 
          transition-all duration-300 p-5 
          ${menuOpen ? "block" : "hidden"} 
          bg-white sm:bg-[#FEFCF6]/50 sm:backdrop-blur-2xl sm:shadow-2xl sm:rounded-l-xl
        `}
      >
        {/* Close Icon (Just X without box) */}
        <div className="flex justify-end mb-3">
          <FiX
            className="text-2xl text-gray-600 hover:text-black cursor-pointer"
            onClick={handleCloseMenu}
          />
        </div>

        {/* Profile */}
        <div className="text-center mb-6">
          <div className="h-24 w-24 mx-auto rounded-full overflow-hidden border-4 border-blue-300 shadow-md">
            {userDetails?.profileImage ? (
              <img
                src={userDetails.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : userDetails?.username ? (
              <div className="bg-gradient-to-br from-pink-400 to-blue-500 text-white flex items-center justify-center h-full text-4xl font-bold">
                {userDetails.username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src="/default-avatar.png"
                alt="Guest"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <h2 className="text-xl font-semibold mt-3 text-gray-800">
            {userDetails?.username || "Guest"}
          </h2>
          <p className="text-sm text-gray-500">
            {userDetails?.email || "guest@example.com"}
          </p>
        </div>

        {/* Login */}
        {!isAuthenticated && (
          <Link
            to="/login"
            className="block text-center bg-blue-600 text-white py-2 rounded-lg font-medium mb-6 hover:bg-blue-700 transition"
            onClick={handleCloseMenu}
          >
            <FiLogIn className="inline mr-2" />
            Login / Register
          </Link>
        )}

        {/* Links */}
        <div className="space-y-4">
          <Link
            to="/wishlist"
            className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={handleCloseMenu}
          >
            <FiHeart />
            <span>Wishlist</span>
          </Link>
          <Link
            to="/checkout"
            className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={handleCloseMenu}
          >
            <FiMapPin />
            <span>Saved Addresses</span>
          </Link>
          <Link
            to="/orderHistory"
            className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={handleCloseMenu}
          >
            <FiClock />
            <span>Order History</span>
          </Link>

          {userDetails?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-yellow-200 rounded-lg hover:bg-yellow-300 transition"
              onClick={handleCloseMenu}
            >
              <FiShield />
              <span className="font-medium">Admin Dashboard</span>
            </Link>
          )}
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <div className="mt-6">
            <button
              onClick={() => setShowLogoutPopup(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        )}
      </motion.div>

      {/* Logout Confirmation */}
      {showLogoutPopup && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-80 text-center">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Are you sure you want to logout?
          </h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 text-base rounded-md font-medium hover:bg-red-700 transition-all shadow-sm"
            >
              Logout
            </button>
            <button
              onClick={() => setShowLogoutPopup(false)}
              className="bg-gray-300 text-gray-800 px-6 py-3 text-base rounded-md font-medium hover:bg-gray-400 transition-all shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default UserMenu;