import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Add role field
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },// Email verification status
    //for forgot and reset password
    otp: { type: String },
    otpExpires: { type: Date },
    //added field for lock 3 times failed password
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null }
},{ timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;