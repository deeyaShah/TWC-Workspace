import express from 'express';
import kitchenController from '../Controller/Kitchens.js';
const router=express.Router();

router
.get('/count',kitchenController.getKitchenProductCount)
.get('/',kitchenController.getAllKitchenProduct)
.get('/:id',kitchenController.getOneKitchenProduct)
.post('/',kitchenController.CreateKitchenProduct)
.put('/:id',kitchenController.UpdateKitchenProduct)
.patch('/:id',kitchenController.ProperKitchenProduct)
.delete('/:id',kitchenController.deleteKitchenProduct)
.get('/search',kitchenController.searchProductsByName);
// exports.router=router;
export default router;