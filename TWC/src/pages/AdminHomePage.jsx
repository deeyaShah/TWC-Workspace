import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#EF4444"]; // Tailwind Indigo, Green, Red

const AdminHomePage = () => {
  const [productCount, setProductCount] = useState(0);
  const [kitchenProductCount, setKitchenProductCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState([]);

  useEffect(() => {
    fetchProductCount();
    fetchKitchenCount();
    fetchOrderCount(); // Only gets total
    fetchOrderStatusData(); // Gets status-wise counts
    fetchRecentOrders();
  }, []);

  const fetchProductCount = async () => {
    try {
      const res = await axios.get("https://twc-workspace.onrender.com/api/products/count");
      setProductCount(res.data.count);
    } catch (error) {
      console.error("Error fetching product count", error);
    }
  };

  const fetchKitchenCount = async () => {
    try {
      const res = await axios.get("https://twc-workspace.onrender.com/Kitchen-Products/api2/v1/count");
      setKitchenProductCount(res.data.count);
    } catch (error) {
      console.error("Error fetching kitchen product count", error);
    }
  };

  const fetchOrderCount = async () => {
    try {
      const { data } = await axios.get("https://twc-workspace.onrender.com/api/orders/count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTotalOrders(data.totalOrders);
    } catch (error) {
      console.error("Error fetching order count:", error);
    }
  };

  const fetchOrderStatusData = async () => {
    try {
      const { data } = await axios.get("https://twc-workspace.onrender.com/api/orders/count-by-status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const chartData = [
        { name: "Completed", value: data.completed || 0 },
        { name: "Pending", value: data.pending || 0 },
        { name: "Cancelled", value: data.cancelled || 0 },
      ];
      setOrderStats(chartData);
    } catch (error) {
      console.error("Error fetching order status counts:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const { data } = await axios.get("https://twc-workspace.onrender.com/api/orders/admin/all-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentOrders(sorted.slice(0, 7));
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-6 pl-10 w-full">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="p-4 shadow-md rounded-lg bg-white">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-4xl mt-2 text-indigo-600">{totalOrders}</p>
          <Link to='/admin/dashboard/orders' className="text-blue-500 hover:underline">
            Manage Orders
          </Link>
        </div>
        <div className="p-4 shadow-md rounded-lg bg-white">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">{productCount + kitchenProductCount}</p>
          <Link to='/admin/dashboard/products' className="text-blue-500 hover:underline">
            Manage Products
          </Link>
        </div>
      </div>

      {/* Pie Chart for Order Status */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10 w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Order Status Distribution</h2>
        {orderStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {orderStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">Loading chart...</p>
        )}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-y-auto max-h-64 border border-gray-200 rounded-md">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase sticky top-0">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">#{order._id}</td>
                    <td className="p-4">{order.user?.username || "N/A"}</td>
                    <td className="p-4">${order.totalPrice}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No Recent Orders Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
