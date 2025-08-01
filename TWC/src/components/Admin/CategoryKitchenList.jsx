import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button, Card, Table, Modal, message, Space, Input, Row, Col, Spin
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import KitchenFormModal from "./KitchenFormModal";

const CategoryKitchenList = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({ name: "", minPrice: "", maxPrice: "" });

  // ✅ Fetch Subcategory Name
  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const response = await axios.get(`https://twc-workspace.onrender.com/api/kitchens/subcategory-details/${subcategoryId}`);
        console.log("🔥 Subcategory ID being fetched:", subcategoryId);
        console.log("Subcategory response:", response.data);
        setSubcategoryName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch subcategory name", error);
        message.error("Failed to load subcategory name");
      }
    };
  
    fetchSubcategory();
  }, [subcategoryId]);

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://twc-workspace.onrender.com/api/kitchens/subcategory/${subcategoryId}`
        );
        console.log("🔥 Products response:", response.data); // Add this
        setProducts(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
        message.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };    
    fetchProducts();
  }, [subcategoryId]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalVisible(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this product?",
      onOk: async () => {
        try {
          await axios.delete(`https://twc-workspace.onrender.com/api/kitchens/${id}`);
          setProducts(products.filter((item) => item._id !== id));
          message.success("Product deleted");
        } catch (err) {
          console.error("Delete error:", err);
          message.error("Failed to delete product");
        }
      },
    });
  };

  const handleFormSubmit = async (productData) => {
    // ✅ Log the submitted product data
    console.log("Submitting product:", productData);
  
    try {
      const payload = {
        ...productData,
        // subcategoryId: subcategoryId,  // Send subcategory ID
        subcategoryName: subcategoryId,
      };
      console.log(payload);
      delete payload.subcategory;

  
      if (selectedProduct) {
        const response = await axios.put(
          `https://twc-workspace.onrender.com/api/kitchens/${selectedProduct._id}`,
          payload
        );
        setProducts((prev) =>
          prev.map((item) => (item._id === selectedProduct._id ? response.data : item))
        );
        message.success("Product updated");
      } else {
        const response = await axios.post(
          "https://twc-workspace.onrender.com/api/kitchens",
          payload
        );
  
        setProducts((prev) => [...prev, response.data.product]);
        message.success("Product added");
      }
      setModalVisible(false);
    } catch (err) {
      console.error("Form submit error:", err);
      message.error("Failed to save product");
    }
  };
  

  // const filteredProducts = products.filter((product) => {
  //   const matchesName = product.name?.toLowerCase().includes(filters.name.toLowerCase());
  //   const matchesMinPrice = !filters.minPrice || parseFloat(product.price) >= parseFloat(filters.minPrice);
  //   const matchesMaxPrice = !filters.maxPrice || parseFloat(product.price) <= parseFloat(filters.maxPrice);
  //   return matchesName && matchesMinPrice && matchesMaxPrice;
  // });
  const filteredProducts = Array.isArray(products)
  ? products.filter((product) => {
      const matchesName = product.name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesMinPrice = !filters.minPrice || parseFloat(product.price) >= parseFloat(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || parseFloat(product.price) <= parseFloat(filters.maxPrice);
      return matchesName && matchesMinPrice && matchesMaxPrice;
    })
  : [];


  const columns = [
    { title: "Product ID", dataIndex: "_id", key: "_id" },
    { title: "Product Name", dataIndex: "name", key: "name" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gray-100 p-6">
      <Card
        title={`Products in "${subcategoryName || "...."}"`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Product
          </Button>
        }
      >
        {/* Filter UI */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={12} md={8}>
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </Col>
          <Col xs={12} md={8}>
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </Col>
        </Row>

        {/* Product Table */}
        {loading ? (
          <Spin size="large" className="flex justify-center" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </Card>

      {/* Add/Edit Product Modal */}
      <KitchenFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onFinish={handleFormSubmit}
        initialValues={selectedProduct}
        subcategory={subcategoryId}
      />
    </div>
  );
};

export default CategoryKitchenList;