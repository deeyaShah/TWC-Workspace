import express from "express";
import kitchenController from "../Controller/kitchenController.js";

const router = express.Router();

// GET products by subcategory ID
router.get("/subcategory/:subcategoryId", kitchenController.getProductsBySubCategory);

// GET a subcategory by ID
router.get("/subcategory-details/:id", kitchenController.getSubcategoryById); // ✅ Give it a unique path
router.get("/kitchens",kitchenController.getAllProducts);
router.get("/count",kitchenController.getProductCount);

// GET a product by record_id
router.get("/kitchen/:id", kitchenController.getProductById); // ✅ Differentiate this too

// Other CRUD routes
router.post("/", kitchenController.createProduct);
router.put("/:id", kitchenController.updateProduct);
router.delete("/:id", kitchenController.deleteProduct);

export default router;
