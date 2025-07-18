import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");
  // console.log(token);
  // Fetch all reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, [token]);

  // Update status (approved / rejected)
  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/reviews/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: data.status } : r))
      );
    } catch (err) {
      console.error(`Failed to ${status} review:`, err);
    }
  };

  const handleApprove = (id) => updateStatus(id, "approved");
  const handleReject = (id) => updateStatus(id, "rejected");

  // Delete a review
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  return (
    <div className="p-6 h-screen overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">Review Management</h2>
      <div className="bg-white p-4 shadow-md rounded-md h-[70vh] overflow-y-auto">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews available.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-300 p-3 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-lg">{review.user.username}</h4>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-yellow-500">⭐ {review.rating}/5</p>
                <span
                  className={`text-sm font-semibold p-1 rounded mt-1 inline-block ${
                    review.status === "approved"
                      ? "bg-green-200 text-green-700"
                      : review.status === "rejected"
                      ? "bg-red-200 text-red-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {review.status || "pending"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(review._id)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => handleReject(review._id)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                >
                  <FaTimes />
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
