import Product from '../Models/product.js'; 

const CreateProduct = async (req, res) => {
    const product = new Product(req.body); 
    try {
        const savedProduct = await product.save(); 
        res.status(201).json(savedProduct); 
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

const getOneProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id); 
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

const UpdateProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }); 
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' }); 
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ProperProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }); 
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' }); 
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' }); 
        }
        res.status(200).json(deletedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Exporting all functions as default
export default {
    CreateProduct,
    getAllProduct,
    getOneProduct,
    UpdateProduct,
    ProperProduct,
    deleteProduct
};