import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Select,
  Button,
  message,
  Card,
  Popconfirm,
  Input,
  Switch,
  Space,
} from "antd";

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `https://twc-workspace.onrender.com/api/users?showDeleted=${showDeleted}`
      );
      const receivedUsers = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(receivedUsers);
    } catch (err) {
      console.error("Fetch Error:", err);
      message.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDeleted]);  

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`https://twc-workspace.onrender.com/api/users/${userId}`, {
        role: newRole,
      });
      message.success("Role updated successfully!");
      fetchUsers();
    } catch (err) {
      message.error("Failed to update role");
    }
  };

  // const handleSoftDelete = async (userId) => {
  //   try {
  //     await axios.put(`http://localhost:5000/api/users/soft-delete/${userId}`);
  //     message.success("User soft-deleted!");
  //     fetchUsers();
  //   } catch (err) {
  //     message.error("Failed to soft-delete user");
  //   }
  // };

  const handlePermanentDelete = async (userId) => {
    try {
      await axios.delete(
        `https://twc-workspace.onrender.com/api/users/permanent-delete/${userId}`
      );
      message.success("User permanently deleted!");
      fetchUsers();
    } catch (err) {
      message.error("Failed to permanently delete user");
    }
  };

  // const handleRestore = async (userId) => {
  //   try {
  //     await axios.put(`http://localhost:5000/api/users/restore/${userId}`);
  //     message.success("User restored!");
  //     fetchUsers();
  //   } catch (err) {
  //     message.error("Failed to restore user");
  //   }
  // };

  // ✅ Fixed filter logic here
  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    const matchSearch = user.username
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchDeleted = showDeleted ? user.isDeleted : !user.isDeleted;
    return matchRole && matchSearch && matchDeleted;
  });

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          value={role}
          disabled={record.isDeleted} // prevent editing role of deleted user
          onChange={(value) => handleRoleChange(record._id, value)}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record.isDeleted ? (
          <span className="text-red-500 font-semibold">Deleted</span>
        ) : (
          <span className="text-green-600 font-semibold">Active</span>
        ),
    },
    {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            {/* {!record.isDeleted ? (
              <Popconfirm
                title="Soft delete this user?"
                onConfirm={() => handleSoftDelete(record._id)}
              >
                <Button danger>Soft Delete</Button>
              </Popconfirm>
            ) : (
              <Button onClick={() => handleRestore(record._id)}>Restore</Button>
            )} */}
      
            <Popconfirm
              title="Permanently delete this user? This cannot be undone!"
              onConfirm={() => handlePermanentDelete(record._id)}
            >
              <Button danger type="primary">
                Delete Forever
              </Button>
            </Popconfirm>
          </Space>
        ),
      }      
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card
        title="User Management"
        className="w-full max-w-6xl shadow-xl border rounded-xl"
      >
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          <Input
            placeholder="Search by username"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
          <Select
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            className="w-40"
          >
            <Option value="all">All Roles</Option>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
          {/* <div className="flex items-center gap-2">
            <span>Show Deleted</span>
            <Switch checked={showDeleted} onChange={setShowDeleted} />
          </div> */}
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
        />
      </Card>
    </div>
  );
};

export default UserManagement;
