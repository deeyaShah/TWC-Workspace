// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Ensure to include the .js extension
import authRoutes from './routers/auth.js';             // Login / Register
import userManagementRoutes from './routers/userManagement.js'; // Admin: CRUD Users
import loginActivityRoutes from './routers/userActivity.js';     // Login Activity Logs
import mainCategoryRoutes from "./routers/mainCategoryRoutes.js";   //main categories fetch
import subCategoryRoutes from "./routers/subCategoryRoutes.js";  // Subcategory management 
import cartRoutes from './routers/cartRoutes.js';
import wishlistRoutes from './routers/wishlistRoutes.js';
import productRoutes from './routers/productRoutes.js';
import KitchenRouter from './routers/Kitchen.js';
import addressRouter from './routers/addressRoutes.js';
import SlotRoutes from './routers/SlotBookingRoutes.js';
import orderRoutes from './routers/orderRoutes.js';
import reviewRoutes from './routers/reviewRoutes.js';
import adminMiddleware from './middleware/adminMiddleware.js';
import blogRoutes from './routers/blogRoutes.js';
import path from 'path';

dotenv.config(); // Load environment variables from .env file

connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

const _dirname=path.resolve();


// Middleware to parse JSON
app.use(cors({
    origin: "http://localhost:5173", // 👈 your frontend URL
    credentials: true,              // 👈 allow credentials (cookies, auth headers)
  }));
app.use(express.json({ limit: "20mb" })); // Increase JSON limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded data limit

// Use the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userManagementRoutes); // GET /, PUT /:id, DELETE /:id, etc.
app.use('/api',loginActivityRoutes);
app.use("/api/slot",SlotRoutes);
app.use("/api/main-categories", mainCategoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/wishlist",wishlistRoutes);
// app.use('/Products/api1/v2',ProductRouter);
app.use('/Kitchen-Products/api2/v1',KitchenRouter);
app.use('/api/address',addressRouter);
app.use('/api/orders',orderRoutes);
app.use('/api/reviews',reviewRoutes);
app.use('/api',blogRoutes);

app.get('/admin/dashboard', adminMiddleware, (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard' });
});

app.use(express.static(path.join(_dirname,"/TWC/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname,"TWC","dist","index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});