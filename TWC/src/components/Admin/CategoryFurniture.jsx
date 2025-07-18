import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryFurniture = () => {
  const [categoryName, setCategoryName] = useState("");
  const [furnitureCategories, setFurnitureCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mainCategoryId, setMainCategoryId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;
  const navigate = useNavigate();

  // 🔃 Get Main Category ID
  const fetchMainCategoryId = async () => {
    try {
      const res = await axios.get("https://twc-workspace.onrender.com/api/main-categories");
      const furnitureCategory = res.data.find(
        (cat) => cat.name.toLowerCase() === "modular furniture"
      );
      if (furnitureCategory) {
        setMainCategoryId(furnitureCategory._id);
        return furnitureCategory._id;
      } else {
        message.error("Modular Furniture category not found.");
        return null;
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load main categories.");
      return null;
    }
  };

  // 🔃 Fetch subcategories
  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await axios.get(`https://twc-workspace.onrender.com/api/subcategories/${categoryId}`);
      setFurnitureCategories(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load subcategories.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 On Mount: Fetch main category and subcategories
  useEffect(() => {
    const initialize = async () => {
      const id = await fetchMainCategoryId();
      if (id) await fetchSubCategories(id);
    };
    initialize();
  }, []);

  const handleAddCategory = async () => {
    if (categoryName.trim()) {
      if (editMode) {
        // 🔄 Update Existing Category
        try {
          await axios.put(`https://twc-workspace.onrender.com/api/subcategories/${editCategoryId}`, {
            name: categoryName,
            mainCategory: mainCategoryId,
          });
  
          await fetchSubCategories(mainCategoryId); // ✅ Refetch fresh list
          message.success("Category updated successfully!");
        } catch (err) {
          console.error(err);
          message.error("Failed to update category.");
        }
      } else {
        // ➕ Add New Category
        try {
          await axios.post("https://twc-workspace.onrender.com/api/subcategories", {
            name: categoryName,
            mainCategory: mainCategoryId,
          });
  
          await fetchSubCategories(mainCategoryId); // ✅ Refetch fresh list
          message.success("Category added successfully!");
        } catch (err) {
          console.error(err);
          message.error("Failed to add category.");
        }
      }
  
      // Reset form
      setCategoryName("");
      setEditMode(false);
      setEditCategoryId(null);
    } else {
      message.warning("Please enter a category name.");
    }
  };
  
  
  // const handleEdit = async (id) => {
  //   const toEdit = furnitureCategories.find((cat) => cat._id === id);
  //   setCategoryName(toEdit.name);
  //   // Note: You might want to implement a proper edit functionality instead of deleting
  // };

  const handleEdit = (id) => {
    const toEdit = furnitureCategories.find((cat) => cat._id === id);
    setCategoryName(toEdit.name);
    setEditCategoryId(id);
    setEditMode(true);
  };
  const handleDelete = async (id) => {
  try {
    await axios.delete(`https://twc-workspace.onrender.com/api/subcategories/${id}`);
    message.success("Category deleted.");
    await fetchSubCategories(mainCategoryId); // ✅ Re-fetch
  } catch (err) {
    console.error(err);
    message.error("Failed to delete category.");
  }
};


  const handleRowClick = (record) => {
    navigate(`/admin/dashboard/category/furniture/${record._id}`);
  };

  const columns = [
    {
      title: "ID",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Category Name",
      dataIndex: "name",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record._id);
            }}
            type="primary"
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record._id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
                        icon={<DeleteOutlined />}
                        type="primary"
                        danger
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ];
            
            return (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Manage Modular Furniture Categories</h2>
            
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <Input
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    style={{ width: 300 }}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddCategory}
                    disabled={!mainCategoryId}
                  >
                    Add Category
                  </Button>
                </div>
            
                {loading ? (
                  <div className="text-center py-10">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={furnitureCategories.map((cat) => ({ ...cat, key: cat._id }))}
                    pagination={{
                      current: currentPage,
                      pageSize,
                      onChange: (page) => setCurrentPage(page),
                    }}
                    bordered
                    onRow={(record) => ({
                      onClick: () => handleRowClick(record),
                    })}
                    rowClassName="cursor-pointer hover:bg-gray-100"
                  />
                )}
              </div>
            );
            };
            
            export default CategoryFurniture;