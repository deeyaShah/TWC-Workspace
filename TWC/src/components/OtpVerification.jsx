//to solve error
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./OtpVerification.css"; // Import the CSS file for styling

const OtpVerification = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
    const [email, setEmail] = useState(""); // Store extracted email
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    // Extract email from location.state or localStorage
    useEffect(() => {
        const extractedEmail = location.state?.email || localStorage.getItem("userEmail");

        if (extractedEmail) {
            setEmail(extractedEmail);
            localStorage.setItem("userEmail", extractedEmail); // Store for future use
        } else {
            toast.error("Email not found. Please register again.");
        }
    }, [location.state]);

    // Handle OTP input changes
    const handleChange = (index, value) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next input box
            if (value !== "" && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    // Handle backspace key
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Submit OTP for verification
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const enteredOtp = otp.join(""); // Combine digits into a full OTP
        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp: enteredOtp });

            if (response.data.success) {
                toast.success("OTP Verified Successfully!");
                localStorage.removeItem("userEmail"); // Clear stored email after verification
                navigate("/login"); // Redirect after successful OTP verification
            } else {
                toast.error(response.data.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error response:", err.response?.data);
            toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-wrapper">
            <div className="otp-container">
                <h2>OTP Verification</h2>
                <p className="otp-subtext">Enter the 6-digit code sent to <strong>{email}</strong></p>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit} className="otp-form">
                    <div className="otp-input-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="otp-input"
                            />
                        ))}
                    </div>
                    <button type="submit" disabled={loading} className="otp-button">
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <p className="otp-resend-text">
                    Didn't receive an OTP?{" "}
                    <button onClick={() => alert("Resend OTP functionality here")} className="otp-resend-button">
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OtpVerification;
