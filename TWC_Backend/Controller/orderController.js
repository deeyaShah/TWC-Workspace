// controllers/orderController.js
import Order from '../Models/Order.js';
import subProduct from '../Models/subProduct.js';
import Address from '../Models/Address.js';
import Razorpay from 'razorpay';

// Initialize Razorpay instance with your API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Store in .env file
  key_secret: process.env.RAZORPAY_SECRET, // Store in .env file
});

const createOrder = async (req, res) => {
    try {
      const { addressId, cartItems, paymentMethod } = req.body;
  
      const address = await Address.findById(addressId);
      if (!address) {
        return res.status(400).json({ message: 'Address not found' });
      }
  
      const cleanCartItems = cartItems.map(item => ({
        product: typeof item.product === 'object' ? item.product._id : item.product,
        quantity: item.quantity
      }));
  
      const products = await subProduct.find({ '_id': { $in: cleanCartItems.map(i => i.product) } });
  
      if (products.length !== cleanCartItems.length) {
        throw new Error('One or more products not found');
      }
  
      // Calculate total price
      let totalPrice = 0;
        const items = cleanCartItems.map(item => {
        const matchedProduct = products.find(p => p._id.toString() === item.product);
        if (!matchedProduct) {
          throw new Error('Product not found');
        }
      
        const price = matchedProduct.price || 0;
        const productName = matchedProduct.name || 'Unknown Product';
        totalPrice += price * item.quantity + 1000;
      
        return {
          product: matchedProduct._id,
          productName,
          price,
          quantity: item.quantity
        };
      });
      
      // If payment method is Razorpay, create a Razorpay order
      if (paymentMethod === 'Razorpay') {
        try {
          const razorpayOrder = await razorpay.orders.create({
            amount: totalPrice * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
          });
          return res.status(200).json({
            razorpayOrderId: razorpayOrder.id,
            amount: totalPrice * 100,
            currency: 'INR',
            orderItems: {
              user: req.user.id,
              address: addressId,
              items,
              paymentMethod,
              totalPrice,
            },
          });
        } catch (razorpayError) {
          console.error('Razorpay order creation failed:', razorpayError);
          return res.status(500).json({ message: 'Failed to create Razorpay order' });
        }
      }
      //For COD, proceed with creating order in MongoDB
      const order = new Order({
        user: req.user.id,
        address: addressId,
        items,
        paymentMethod,
        totalPrice
      });
  
      const savedOrder = await order.save();
  
      res.status(201).json({ order: savedOrder });
  
    } catch (err) {
      console.error('Create Order Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // New endpoint to verify Razorpay payment and save order
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderItems } = req.body;

    // Verify Razorpay signature
    const crypto = await import('crypto'); // Dynamic import for Node.js
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Save order in MongoDB after successful payment
    const order = new Order({
      user: orderItems.user,
      address: orderItems.address,
      items: orderItems.items,
      paymentMethod: orderItems.paymentMethod,
      totalPrice: orderItems.totalPrice,
      status: 'Completed', // Mark as completed since payment is verified
      razorpayDetails: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
    });

    const savedOrder = await order.save();
    res.status(201).json({ order: savedOrder });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email') // get name and email from User model
      .populate('address') // optional: you can also populate address if needed
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Get All Orders Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'username email') // populate user fields if needed
      .populate('address') // populate address details
      .populate('items.product'); // populate product details if needed

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getAllOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({ totalOrders: count });
  } catch (error) {
    console.error('Get Total Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch total order count', error });
  }
};
const getOrderCountsByStatus = async (req, res) => {
  try {
    const completed = await Order.countDocuments({ status: "Completed" });
    const pending = await Order.countDocuments({ status: "Pending" });
    const cancelled = await Order.countDocuments({ status: "Cancelled" });

    res.status(200).json({
      completed,
      pending,
      cancelled,
    });
  } catch (error) {
    console.error("Order Status Count Error:", error);
    res.status(500).json({ message: "Failed to fetch order counts by status", error });
  }
};

const updateStcok=async(req,res)=>
{
  try {
    const { items } = req.body;

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(200).json({ message: 'Stock updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock', error: error.message });
  }
}
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate({
        path: 'address',
        select: 'firstName lastName address city state postalCode phoneNumber',
      })
      .populate({
        path: 'items.product',
        select: 'name images',
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const updateTrackingInfo = async (req, res) => {
  const { orderId } = req.params;
  const { trackingId, currentStatus } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.tracking = {
      trackingId,
      currentStatus,
      lastUpdated: new Date(),
    };

    await order.save();
    res.status(200).json({ message: 'Tracking info updated successfully' });
  } catch (error) {
    console.error('Error updating tracking info:', error);
    res.status(500).json({ message: 'Failed to update tracking info' });
  }
};
export default {
  createOrder,
  verifyPayment,
  getAllOrders,
  getOrderById,
  updateOrderStatus, 
  getAllOrderCount,
  updateStcok,
  getOrderCountsByStatus,
  getMyOrders,
  updateTrackingInfo
};
