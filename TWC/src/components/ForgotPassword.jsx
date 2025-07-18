import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

//   const BACKEND_URL = "http://localhost:5000/api/auth";
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("OTP sent to your email.");
//     localStorage.setItem("resetEmail", email);
//     setTimeout(() => navigate("/otp-verify"), 1000);
//   };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
    
        try {
        const res = await axios.post(`http://localhost:5000/api/auth/forgot-password`, { email });
        toast.success(res.data.message || "OTP sent to your email.");
        localStorage.setItem("resetEmail", email);
        setTimeout(() => navigate("/otp-verify"), 1000);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to send OTP.");
        }
    };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Forgot Password</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
        <p style={{ textAlign: "center" }}>
          Go back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;