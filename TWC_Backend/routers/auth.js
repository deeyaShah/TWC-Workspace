// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/users.js';
import Otp from '../Models/otp.js';
import authMiddleware from '../middleware/authMiddleware.js';
import sendOtpEmail from '../utils/emailService.js';

const router = express.Router();
const MAX_FAILED_ATTEMPTS=2;

// REGISTER USER & SEND OTP
router.post('/register', async (req, res) => {
    const { username, email, password, role, secretKey } = req.body;

    try {
        // Check admin registration
        if (role === 'admin') {
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (existingAdmin) return res.status(400).json({ message: 'Only one admin allowed.' });

            if (secretKey !== process.env.ADMIN_SECRET_KEY) {
                return res.status(403).json({ message: 'Invalid secret key for admin registration' });
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role, isVerified: false });

        await newUser.save();

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10); // Hash OTP

        await new Otp({ email, otp: hashedOtp }).save();
        await sendOtpEmail(email, otp);

        res.status(201).json({ message: 'OTP sent to email. Please verify to complete registration.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord || !(await bcrypt.compare(otp, otpRecord.otp))) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Verify user email
        await User.updateOne({ email }, { isVerified: true });

        // Remove OTP from database
        await Otp.deleteOne({ email }); // ✅ Remove OTP record for this email

        // ✅ Add success: true in the response
        res.json({ 
            success: true, 
            message: 'Email verified successfully. You can now log in.' 
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

//Forgot Password send OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Always return generic response for security
        if (!user) {
            return res.status(200).json({ message: 'If this email exists, an OTP will be sent.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

        // Hash the OTP using bcrypt
        const hashedOtp = await bcrypt.hash(otp, 10); // 10 salt rounds
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // expires in 5 minutes

        await user.save();

        await sendOtpEmail(user.email, otp);

        return res.status(200).json({ message: 'OTP sent to your email.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

//Send OTP
router.post('/otp-verify', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'OTP not requested or expired.' });
        }

        // Check if OTP is expired
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        // Compare entered OTP with hashed OTP
        const isMatch = await bcrypt.compare(otp, user.otp);

        if (isMatch) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        
            return res.status(200).json({
                message: 'OTP verified successfully.',
                token, // send to frontend
            });
        }

    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/reset-password', authMiddleware,async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const email = req.user.email; // from JWT

    try {
        // Check if both passwords are provided
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Both new and confirm password are required.' });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        // Get user email from session or token (e.g., req.user.email)
        // const email = req.user?.email; // Make sure this is set by your auth middleware

        if (!email) {
            return res.status(401).json({ message: 'Unauthorized or session expired.' });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Optional: clear OTP fields
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        return res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) return res.status(400).json({ message: 'Email not verified. Please verify first.' });

        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(403).json({
                message: 'Account is temporarily locked due to too many failed attempts.',
                lockUntil: user.lockUntil,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            if (user.loginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil = Date.now() + 2 * 60 * 1000; // ⏱️ Lock for 2 minutes
                await user.save();
                return res.status(403).json({
                    message: 'Too many failed attempts. Please try again later.',
                    lockUntil: user.lockUntil,
                });
            } else {
                await user.save();
            }

            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // On successful login
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '60d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;