// routes/wishlistRoutes.js
import express from 'express';
import wishlistController from '../Controller/wishlistController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware,wishlistController.getWishlist);
router.post("/add", authMiddleware, wishlistController.addToWishlist);
router.delete('/:productId', authMiddleware, wishlistController.removeFromWishlist);

export default router;