import express from "express";
import getSubCategories from "../Controller/subCategoryController.js";

const router = express.Router();

router.post("/", getSubCategories.createSubCategory); // Add new subcategory
router.get("/:mainCategoryId", getSubCategories.getSubCategories); // Get subcategories for main category
router.put("/:id", getSubCategories.updateSubCategory); // Edit subcategory
router.delete("/:id",getSubCategories.deleteSubCategories); // Delete subcategory

export default router;
