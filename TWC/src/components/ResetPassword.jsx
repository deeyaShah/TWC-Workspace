import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
    
        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          return; 
        }
    
        // const email = localStorage.getItem("resetEmail");
        
        const token = localStorage.getItem("resetToken"); // ✅ Get JWT token
    
        try {
            const res = await axios.post(
              `http://localhost:5000/api/auth/reset-password`,
              {
                newPassword: password,
                confirmPassword,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`, // ✅ Send token here
                },
              }
            );
        
            toast.success(res.data.message || "Password reset successful");
        
            setTimeout(() => {
              localStorage.removeItem("resetEmail");
              localStorage.removeItem("resetToken"); // ✅ Clear token after success
              navigate("/login");
            }, 1500);
          } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password.");
          }
        };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Reset Password</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
