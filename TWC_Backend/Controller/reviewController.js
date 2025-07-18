// controllers/reviewController.js
import Review from '../Models/Review.js';
import Order from '../Models/Order.js';

// 1. Create a review
 const createReview = async (req, res) => {
  try {
    const { order: orderId, product: productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Ensure the user actually ordered this product
    const order = await Order.findById(orderId);
    if (!order || !order.items.some(i => i.product.toString() === productId)) {
      return res.status(400).json({ message: 'Invalid order or product' });
    }

    // Prevent double-review of same product in the same order
    const existing = await Review.findOne({ user: userId, order: orderId, product: productId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const review = new Review({
      user: userId,
      order: orderId,
      product: productId,
      rating,
      comment,
      status: 'pending'
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Create Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. List reviews for a product (public)
const getProductReviews = async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await Review.find({ product: productId })
        .populate('user', 'username')
        .sort({ createdAt: -1 });
  
      res.json(reviews);
    } catch (err) {
      console.error('Get Product Reviews Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
// 3. Admin: list all reviews
 const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'username email')
      .populate('product', 'name')
      .populate('order', '_id')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Get All Reviews Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Admin: update a review
 const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, status } = req.body;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    if (status) review.status = status;
    await review.save();
    res.json(review);
  } catch (err) {
    console.error('Update Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Admin: delete a review
 const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Delete Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReview,
  deleteReview
};
