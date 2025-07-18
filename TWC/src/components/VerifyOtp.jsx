import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "./Login.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
    
        const email = localStorage.getItem("resetEmail");
    
        try {
        const res = await axios.post(`https://twc-workspace.onrender.com/api/auth/otp-verify`, { email, otp });
        toast.success(res.data.message); // ✅ Success toast
        localStorage.setItem("resetToken", res.data.token);
        setTimeout(() => navigate("/reset-password"), 1000);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to verify OTP."); // ✅ Error toast
        }
    };
    
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
