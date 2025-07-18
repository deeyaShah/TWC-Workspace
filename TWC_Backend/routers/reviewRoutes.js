import express from 'express';
import reviewController from '../Controller/reviewController.js';
import protect from '../middleware/authMiddleware.js';
// import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public: fetch reviews for a single product
router.get('/:productId', reviewController.getProductReviews);

// Authenticated users: submit a review
router.post('/', protect, reviewController.createReview);

// Admin-only: full CRUD
router.get('/', protect, reviewController.getAllReviews);
router.patch('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

export default router;
