import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (lockUntil) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(lockUntil).getTime() - now;

        if (distance <= 0) {
          clearInterval(timer);
          setLockUntil(null);
          setTimeLeft(null);
          setError("");
        } else {
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockUntil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://twc-workspace.onrender.com/api/auth/login", {
        username,
        password,
      });

      const { token, user } = response.data;
      const userRole = user?.role || "user";

      localStorage.setItem("token", token);
      localStorage.setItem("userDetails", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      window.dispatchEvent(new Event("userLogin"));
      toast.success("Login successful!");

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Login failed";
      const lockExpiry = err.response?.data?.lockUntil;

      if (err.response?.status === 403 && lockExpiry) {
        setLockUntil(lockExpiry);
        toast.error("Too many failed attempts. Please try again later.");
      } else {
        toast.error(serverMessage);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {timeLeft && (
          <p className="error-message">
            Account is locked. Try again in <strong>{timeLeft}</strong>
          </p>
        )}
                <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-wrapper">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              disabled={!!lockUntil}
            />
          </div>

          {/* Password with Eye Icon */}
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={!!lockUntil}
            />
            <span
              className="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button type="submit" disabled={!!lockUntil}>
            {lockUntil ? "Locked" : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center" }}>
          Create an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
