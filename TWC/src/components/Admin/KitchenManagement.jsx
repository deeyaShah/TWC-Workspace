import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Pagination,
  Space,
  message,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

const API_BASE = "https://twc-workspace.onrender.com/Kitchen-Products/api2/v1"; // Update if hosted

const KitchenManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addImageList, setAddImageList] = useState([]);
  const [editImageList, setEditImageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}`);
      setProducts(res.data);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  const handleAddProduct = async (values) => {
    try {
      const newProduct = {
        title: values.title,
        Description: values.Description,
        Details: values.Details,
        images: addImageList.map((file) => file.name),
      };
      await axios.post(`${API_BASE}`, newProduct);
      message.success("Product added successfully!");
      setIsAddModalOpen(false);
      form.resetFields();
      setAddImageList([]);
      fetchProducts();
    } catch (error) {
      message.error("Failed to add product");
    }
  };
  
  const handleEditProduct = async (values) => {
    try {
      const updatedProduct = {
        title: values.title,
        Description: values.Description,
        Details: values.Details,
        images: editImageList.length
          ? editImageList.map((file) => file.name)
          : editingProduct.images,
      };
      await axios.put(`${API_BASE}/${editingProduct._id}`, updatedProduct);
      message.success("Product updated successfully!");
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditImageList([]);
      fetchProducts();
    } catch (error) {
      message.error("Failed to update product");
    }
  };
  

  const handleDeleteProduct = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE}/${id}`);
          message.success("Product deleted!");
          fetchProducts();
        } catch (error) {
          message.error("Failed to delete product");
        }
      },
    });
  };

  const openEditModal = (record) => {
    setEditingProduct(record);
    editForm.setFieldsValue({
      title: record.title,
      Description: record.Description,
      Details: record.Details,
    });
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "Description",
    },
    {
      title: "Image",
      dataIndex: "images",
      render: (images) => <span>{images?.[0]}</span>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProduct(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const paginatedData = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 bg-white shadow rounded-lg min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Kitchen Product Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="_id"
        pagination={false}
      />

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          total={products.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        title="Add Product"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item
            label="Product Name"
            name="title"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Details"
            name="Details"
            rules={[{ required: true, message: "Please enter details" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter additional details" />
          </Form.Item>

          <Form.Item label="Upload Image" name="image">
            <Upload
              multiple
              listType="picture"
              beforeUpload={() => false}
              fileList={addImageList}
              onChange={({ fileList }) => setAddImageList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditProduct}>
          <Form.Item
            label="Product Name"
            name="title"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Details"
            name="Details"
            rules={[{ required: true, message: "Please enter details" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter additional details" />
          </Form.Item>

          <Form.Item label="Upload Image" name="image">
            <Upload
              multiple
              listType="picture"
              beforeUpload={() => false}
              fileList={editImageList}
              onChange={({ fileList }) => setEditImageList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KitchenManagement;