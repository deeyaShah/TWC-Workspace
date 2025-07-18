import express from 'express';
// const router = express.Router();
import ordercontroller from '../Controller/orderController.js';
import protect from '../middleware/authMiddleware.js'; // Assuming you have authentication middleware
// import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();
// Create an order
router.post('/', protect, ordercontroller.createOrder);
router.post('/verify',protect,ordercontroller.verifyPayment);
router.get('/admin/all-orders',protect,ordercontroller.getAllOrders);
router.get('/order/:id', protect, ordercontroller.getOrderById);
router.patch('/admin/update-status/:orderId',protect,ordercontroller.updateOrderStatus);
router.get('/count',protect,ordercontroller.getAllOrderCount);
router.post('/update-stock',protect,ordercontroller.updateStcok);
router.get('/count-by-status',protect,ordercontroller.getOrderCountsByStatus);
router.get('/my-orders',protect,ordercontroller.getMyOrders);
router.put('/tracking/:orderId',protect,ordercontroller.updateTrackingInfo);
export default router;

