// controllers/productController.js
import Product from "../Models/subProduct.js";
import SubCategory from "../Models/SubCategory.js";

//create a new product controller
// Create Product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log("Error saving product:", error); // 👈 Check this log
    res.status(400).json({ success: false, message: "Failed to save product" });
  }
  
};
// Get Products by Subcategory ID (from params)
const getProductsBySubCategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const products = await Product.find({ subcategoryName: subcategoryId });

    if (!products.length) {
      return res.status(404).json({ message: "No products found in this subcategory" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//get all products
// controllers/productController.js
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(product);
};
//get product count
const getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting product count" });
  }
};

// ✅ Get Subcategory by ID
const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    console.error("Error in getSubcategoryById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product by record_id
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
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
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const searchProductsByName = async (req, res) => {
  try {
    const query = req.query.name || '';
    const products = await Product.find({
      name: { $regex: query, $options: 'i' } // case-insensitive match
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
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
  searchProductsByName,
};