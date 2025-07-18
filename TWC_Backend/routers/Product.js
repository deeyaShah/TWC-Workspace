import express from 'express';
import ProductController from '../Controller/Products.js';
const router=express.Router();

router
.get('/',ProductController.getAllProduct)
.get('/:id',ProductController.getOneProduct)
.post('/',ProductController.CreateProduct)
.put('/:id',ProductController.UpdateProduct)
.patch('/:id',ProductController.ProperProduct)
.delete('/:id',ProductController.deleteProduct)

// exports.router=router;
export default router;