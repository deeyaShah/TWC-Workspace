//first try with razorpay
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { addressId } = state || {};
  const { cartItems ,clearCart} = useCart();

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Function to load Razorpay checkout script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        toast.success('Razorpay loaded');
        resolve(true);
      };
      script.onerror = () => {
        toast.error('Failed to load Razorpay');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const handlePaymentButtonClick = async () => {
    try {
      const orderData = {
        addressId,
        cartItems,
        paymentMethod: paymentMethod === 'cash' ? 'COD' : 'Razorpay',
      };

      if (paymentMethod === 'cash') {
        // Handle COD
        const res = await axios.post('https://twc-workspace.onrender.com/api/orders', orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const order = res.data.order;
        toast.success('Order placed with COD');
        clearCart();
        navigate('/order', { state: { order } });
      } else {
        // Handle Razorpay
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error('Failed to load Razorpay SDK. Try again.');
          return;
        }

        // Call backend to create Razorpay order
        const res = await axios.post('https://twc-workspace.onrender.com/api/orders', orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { razorpayOrderId, amount, currency, orderItems } = res.data;
        
        // Initialize Razorpay checkout
        const options = {
          key: 'rzp_test_I4IT92uVl1sBEK', // Store in .env file (frontend)
          amount,
          currency,
          order_id: razorpayOrderId,
          name: 'TWC',
          description: 'Order Payment',
          handler: async function (response) {
            // Verify payment with backend
            try {
              const verifyRes = await axios.post(
                'https://twc-workspace.onrender.com/api/orders/verify',
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderItems,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );

              const verifiedOrder = verifyRes.data.order;
              toast.success('Payment successful!');
              clearCart();
              navigate('/order', { state: { order : verifiedOrder} });
            } catch (verifyErr) {
              console.error('Payment verification failed:', verifyErr);
              toast.error('Payment verification failed. Contact support.');
            }
          },
          prefill: {
            name: 'Deeya Shah', // Optionally fetch from user profile
            email: 'diyashah@gmail.com', // Optionally fetch from user profile
            contact: '9999999999', // Optionally fetch from user profile
          },
          theme: {
            color: '#F37254',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  useEffect(() => {
  }, [addressId, cartItems]);

  return (
    <div className="payment-container">
      <h2 className="payment-title">Select Payment Method</h2>
      <div className="payment-option">
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={handlePaymentMethodChange}
          />
          Cash on Delivery
        </label>
        <p className="payment-description"><strong>Pay at your doorstep</strong></p>
      </div>
      <div className="payment-option">
        <label>
          <input
            type="radio"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={handlePaymentMethodChange}
          />
          Online Payment
        </label>
        <p className="payment-description"><strong>UPI / Card / Netbanking</strong></p>
      </div>
      <div className="button-container">
        <button className="pay-button" onClick={handlePaymentButtonClick}>
          {paymentMethod === 'cash' ? 'Pay COD' : 'Pay with Razorpay'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
