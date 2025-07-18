import Kitchen from "../Models/subKitchen.js";
import SubCategory from "../Models/SubCategory.js";
// Create Product
const createProduct = async (req, res) => {
  try {
    const product = new Kitchen(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to save product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Kitchen.find({});
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get Product by record_id
const getProductById = async (req, res) => {
  const product = await Kitchen.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(product);
};
//get product count
const getProductCount = async (req, res) => {
  try {
    const count = await Kitchen.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting product count" });
  }
};

// Update Product by record_id
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Kitchen.findByIdAndUpdate(
      req.params.id,       // Uses _id from MongoDB
      req.body,
      { new: true }        // Returns the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Delete Product by record_id
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Kitchen.findOneAndDelete( req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createProduct,
  getProductById,
  getAllProducts,
  getProductCount,
  updateProduct,
  deleteProduct,
  getProductsBySubCategory,
  getSubcategoryById, // ✅ export this too
};