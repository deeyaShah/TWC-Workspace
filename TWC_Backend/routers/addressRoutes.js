import express from 'express';
import addressController from '../Controller/addressController.js';
import  isAuthenticated  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', isAuthenticated, addressController.saveAddress);
router.get('/my-addresses', isAuthenticated, addressController.getUserAddresses);
router.put('/update/:id', isAuthenticated, addressController.updateAddress);
router.delete('/delete/:id', isAuthenticated, addressController.deleteAddress);

export default router;
