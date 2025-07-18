import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const response = await axios.get('http://localhost:5000/api/orders/my-orders', config);
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-xl shadow-md p-5 mb-6 bg-white"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <p><span className="font-semibold">Order ID:</span> {order._id}</p>
              <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold">Status:</span> {order.status}</p>
              <p><span className="font-semibold">Total:</span> ₹{order.totalPrice}</p>
            </div>
            <button
              onClick={() => toggleExpand(order._id)}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
              {expandedOrderId === order._id ? 'Hide Details' : 'View Details'}
            </button>
          </div>

          {expandedOrderId === order._id && (
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold mb-2">Delivery Address:</p>
              <p className="mb-4">
                {/* {order.address?.firstName} {order.address?.lastName},<br /> */}
                {order.address?.address}, {order.address?.city}, {order.address?.state} - {order.address?.postalCode}<br />
                Phone: {order.address?.phoneNumber}
              </p>

              <p className="font-semibold mb-2">Payment Method:</p>
              <p className="mb-4">{order.paymentMethod}</p>

            {/* track of my order */}
            {order.tracking && order.tracking.trackingId ? (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Tracking Info:</p>
                  {/* <p>Courier: {order.tracking.courier}</p> */}
                  <p>Tracking ID: {order.tracking.trackingId}</p>
                  {order.tracking.trackingUrl && (
                    <a
                      href={order.tracking.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Track Package
                    </a>
                  )}
                  <p>Status: {order.tracking.currentStatus || 'Processing'}</p>
                </div>
              ) : (
                <p className="text-red-500 mt-2">Track not available</p>
              )}

              <p className="font-semibold mb-2">Items Ordered:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border p-3 rounded-md shadow-sm"
                  >
                    <img
                      src={item.product?.images?.[0] || '/placeholder.jpg'}
                      alt={item.product?.name || item.productName}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-semibold">{item.product?.name || item.productName}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
