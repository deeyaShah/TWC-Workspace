import Wishlist from "../Models/Wishlist.js";
import Product from "../Models/subProduct.js";

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist", error: err });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(wishlist.products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist", error: err });
  }
};

// Remove a product from the wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist", error: err });
  }
};

export default {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
