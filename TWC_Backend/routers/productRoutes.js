import express from "express";
import productController from "../Controller/productController.js";

const router = express.Router();

// GET products by subcategory ID
router.get("/subcategory/:subcategoryId", productController.getProductsBySubCategory);

// GET a subcategory by ID
router.get("/subcategory-details/:id", productController.getSubcategoryById); // ✅ Give it a unique path
router.get("/products",productController.getAllProducts);
router.get("/count",productController.getProductCount);
router.get('/search', productController.searchProductsByName);
// GET a product by record_id
router.get("/product/:id", productController.getProductById); // ✅ Differentiate this too

// Other CRUD routes
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
