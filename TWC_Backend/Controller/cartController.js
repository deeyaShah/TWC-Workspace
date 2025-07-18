import Cart from '../Models/Cart.js';
import Product from '../Models/subProduct.js';

// Add to Cart
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    // if (existingItem) {
    //   existingItem.quantity += quantity;
    // } else {
    //   cart.items.push({ productId, quantity });
    // }
    if (existingItem) {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock available' });
      }
      existingItem.quantity += quantity;
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock available' });
      }
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    product.stock -= quantity;
    await product.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    // Format the cart items for frontend
    const cartItems = cart.items.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      product: {
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0], // Make sure 'images' exists in your product model
      },
    }));

    res.json({ items: cartItems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    const oldQuantity = cart.items[itemIndex].quantity;
    const stockDifference = quantity - oldQuantity;

    if (stockDifference > 0 && product.stock < stockDifference) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Update the stock accordingly
    // product.stock -= stockDifference;
    if (stockDifference > 0) {
      product.stock -= stockDifference;
    } else {
      product.stock += Math.abs(stockDifference);
    }
    await product.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    const removedQuantity = cart.items[itemIndex].quantity;

    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Update product stock
    const product = await Product.findById(productId);
    if (product) {
      product.stock += removedQuantity;
      await product.save();
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteCart=async(req,res)=>{
  try {
    const userId = req.user.id;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
}
export default{
    addToCart,
    getCart,
    removeFromCart,
    updateCart,
    deleteCart,
};