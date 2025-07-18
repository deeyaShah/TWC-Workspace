// middleware/validateProduct.js
import { body } from "express-validator";

const validateProduct = [
  body("name").notEmpty().withMessage("Name is required").isString().isLength({ min: 3 }),
  body("sku").optional().isString(),
  body("price").notEmpty().withMessage("Price is required").isFloat({ gt: 0 }),
  body("countInStock").optional().isInt({ min: 0 }),
  body("type").notEmpty().withMessage("Type is required").isIn(["kitchen", "furniture"]),
  body("category").notEmpty().withMessage("Category is required").isString(),
  body("description").optional().isString(),
  body("images").optional().isArray(),
  body("images.*").optional().isURL().withMessage("Each image must be a valid URL"),
  body("rating").optional().isFloat({ min: 0, max: 5 }),
  body("subCategory")
    .notEmpty()
    .withMessage("SubCategory ID is required")
    .isMongoId()
    .withMessage("Invalid SubCategory ID format"),
];
export default validateProduct;