import Kitchen from '../Models/kitchen.js'; // Import the default export directly

const CreateKitchenProduct = async (req, res) => {
    const kitchens = new Kitchen(req.body); // Create a new product instance
    try {
        const savedProduct = await kitchens.save(); // Save the product
        res.status(201).json(savedProduct); // Send the created product in the response
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};

const getAllKitchenProduct = async (req, res) => {
    try {
        const kitchens = await Kitchen.find(); // Fetch all products
        res.json(kitchens);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};

const getOneKitchenProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const kitchens = await Kitchen.findById(id); // Fetch a product by ID
        if (!kitchens) {
            return res.status(404).json({ message: 'Product not found' }); // Handle not found
        }
        res.json(kitchens);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};

const UpdateKitchenProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedProduct = await Kitchen.findByIdAndUpdate(id, req.body, { new: true }); // Update the product
        if (!updatedProduct) {
            return res.status(404).json({ message: 'kitchen Product not found' }); // Handle not found
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};

const ProperKitchenProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedProduct = await Kitchen.findByIdAndUpdate(id, req.body, { new: true }); // Update the product
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' }); // Handle not found
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};

const deleteKitchenProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await Kitchen.findByIdAndDelete(id); // Delete the product
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' }); // Handle not found
        }
        res.status(200).json(deletedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};
const searchProductsByName = async (req, res) => {
  try {
    const query = req.query.name || '';
    const products = await Kitchen.find({
      name: { $regex: query, $options: 'i' } // case-insensitive match
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};
const getKitchenProductCount = async (req, res) => {
    try {
      const count = await Kitchen.countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch kitchen product count', error });
    }
  };
  
// Exporting all functions as default
export default {
    CreateKitchenProduct,
    getAllKitchenProduct,
    getOneKitchenProduct,
    UpdateKitchenProduct,
    ProperKitchenProduct,
    deleteKitchenProduct,
    searchProductsByName,
    getKitchenProductCount,
};