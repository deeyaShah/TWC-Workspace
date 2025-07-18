import React, { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 5;

const UserActivity = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLog, setEditingLog] = useState(null); // log being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://twc-workspace.onrender.com/api/user-activity");
      setLogs(res.data);
      setFilteredLogs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this log?")) return;
    try {
      await axios.delete(`https://twc-workspace.onrender.com/api/user-activity/${id}`);
      fetchLogs();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEditClick = (log) => {
    setEditingLog({ ...log }); // Copy the log into editing state
  };

  const handleCancel = () => {
    setEditingLog(null);
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://twc-workspace.onrender.com/api/user-activity/${editingLog._id}`, {
        ipAddress: editingLog.ipAddress,
        userAgent: editingLog.userAgent,
      });
      setEditingLog(null);
      fetchLogs();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = logs.filter((log) =>
      log.userId?.username?.toLowerCase().includes(value) ||
      log.userId?.email?.toLowerCase().includes(value)
    );
    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Login Activity</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by username or email"
        className="mb-4 p-2 border w-1/2"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">IP Address</th>
                <th className="p-2">Device</th>
                <th className="p-2">Time</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log._id} className="border-t">
                    <td className="p-2">{log.userId?.username}</td>
                    <td className="p-2">{log.userId?.email}</td>
                    <td className="p-2">
                      {editingLog && editingLog._id === log._id ? (
                        <input
                          type="text"
                          value={editingLog.ipAddress}
                          onChange={(e) =>
                            setEditingLog({ ...editingLog, ipAddress: e.target.value })
                          }
                          className="border px-2"
                        />
                      ) : (
                        log.ipAddress
                      )}
                    </td>
                    <td className="p-2">
                      {editingLog && editingLog._id === log._id ? (
                        <input
                        type="text"
                          value={editingLog.userAgent}
                          onChange={(e) =>
                            setEditingLog({ ...editingLog, userAgent: e.target.value })
                          }
                          className="border px-2"
                        />
                      ) : (
                        log.userAgent
                      )}
                    </td>
                    <td className="p-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2">
                      {editingLog && editingLog._id === log._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-400 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(log)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserActivity;
