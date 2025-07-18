import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, message, Card, Input, Select } from "antd";

const { Option } = Select;

const subcategories = {
  "Modular Kitchen": ["Island Kitchen", "Acrylic Kitchen", "Modern Kitchen"],
  "Modular Furniture": ["Sofa", "Wardrobe", "Table", "Dining"],
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ type: "", category: "", name: "" });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchProducts();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://twc-workspace.onrender.com/api/products/products"); // Update if your API base URL is different
      setProducts(res.data.products);
    } catch (err) {
      message.error("Failed to load products");
      console.error(err);
    }
  };

  const filteredProducts = products.filter((product) => {
    // const matchesType = filters.type ? product.type === filters.type : true;
    // const matchesCategory = filters.category ? product.category === filters.category : true;
    const matchesName = filters.name
      ? product.name.toLowerCase().includes(filters.name.toLowerCase())
      : true;
    return matchesName;
  });

  const columns = [
    { title: "Product ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    // { title: "Type", dataIndex: "type", key: "type" },
    // { title: "Category", dataIndex: "category", key: "category" },
    { title: "Price", dataIndex: "price", key: "price", render: (text) => `₹${text}` },
    { title: "SKU", dataIndex: "sku", key: "sku" },
  ];

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-6 overflow-hidden">
      <Card title="All Products" className="w-full max-w-6xl shadow-lg">

        {/* FILTERS */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by Name"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            allowClear
            value={filters.name}
          />
        </div>

        {/* PRODUCT TABLE */}
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ y: 500 }}
        />
      </Card>
    </div>
  );
};

export default ProductManagement;
