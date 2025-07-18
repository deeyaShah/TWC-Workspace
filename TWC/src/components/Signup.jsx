import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import toast from 'react-hot-toast';
import './Signup.css'; // Import the CSS file for styling

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user', // Default role
        secretKey: '' // Secret key for admin
    });

    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleRoleChange = (e) => {
        setFormData({ ...formData, role: e.target.value, secretKey: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        if (!passwordRegex.test(formData.password)) {
            toast.error('Password must be 8+ chars with a letter, number & symbol.');
            return;
        }
    
        try {
            const response = await fetch('https://twc-workspace.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Registration successful! Please verify OTP.');
                localStorage.setItem("userEmail", formData.email);  // ✅ Store email in localStorage as backup
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-container">
                <h2>Signup Form</h2>
                {/* {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert">{success}</div>} */}
                <form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="role-selector mb-4">
                    <label className="mr-4">
                    <input
                        type="radio"
                        value="user"
                        checked={formData.role === 'user'}
                        onChange={handleRoleChange}
                    />{' '}
                    User
                    </label>
                    <label>
                    <input
                        type="radio"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={handleRoleChange}
                    />{' '}
                    Admin
                    </label>
                </div>

                {/* Username */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {/* Password */}
                <div className="input-wrapper">
                    <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                    <span className="icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                    </span>
                </div>

                {/* Secret Key for Admin */}
                {formData.role === 'admin' && (
                    <div className="input-wrapper">
                    <input
                        type={showSecretKey ? 'text' : 'password'}
                        name="secretKey"
                        placeholder="Secret Key"
                        value={formData.secretKey}
                        onChange={handleChange}
                        required
                    />
                    <span className="icon" onClick={() => setShowSecretKey(!showSecretKey)}>
                        {showSecretKey ? '👁️' : '👁️‍🗨️'}
                    </span>
                    </div>
                )}

                {/* Submit */}
                <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
