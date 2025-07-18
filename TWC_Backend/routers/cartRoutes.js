import express from 'express';
import cartController from '../Controller/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.put('/update', authMiddleware, cartController.updateCart);
router.post('/remove',authMiddleware,cartController.removeFromCart);
router.delete('/clear',authMiddleware,cartController.deleteCart);
export default router;