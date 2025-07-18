// middlewares/validators/productValidator.js
import { body } from "express-validator";

const productValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("countInStock").optional().isInt({ min: 0 }).withMessage("Count must be a positive integer"),
  body("type").isIn(["kitchen", "furniture"]).withMessage("Type must be 'kitchen' or 'furniture'"),
  body("category").notEmpty().withMessage("Category is required"),
  body("description").optional().isString(),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
  body("subCategory").notEmpty().withMessage("SubCategory is required"),
];
export default productValidationRules;