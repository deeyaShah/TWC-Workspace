import express from "express";
import  getMainCategories  from "../Controller/mainCategoryController.js";

const router = express.Router();

router.get("/", getMainCategories); // Only this one GET route

export default router;
