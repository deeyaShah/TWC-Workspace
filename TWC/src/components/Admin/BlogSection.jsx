import React, { useState, useEffect } from "react";
import { Table, Input, Button, Upload, Modal, Form, Card, message, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();

  //for connecting backend
  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  //for connecting backend
  const handleAddOrUpdateBlog = async (values) => {
    const formattedValues = { ...values, date: values.date.format("YYYY-MM-DD") };
  
    if (editMode) {
      // Update existing blog (PUT request)
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${currentBlog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedValues),
        });
  
        if (!response.ok) throw new Error("Failed to update blog");
  
        const updatedBlog = await response.json();
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
        );
        message.success("Blog updated successfully!");
      } catch (error) {
        console.error("Error updating blog:", error);
        message.error("Failed to update blog");
      }
    } else {
      // Add new blog (POST request)
      try {
        const response = await fetch("http://localhost:5000/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedValues),
        });
  
        if (!response.ok) throw new Error("Failed to add blog");
  
        const newBlog = await response.json();
        setBlogs([...blogs, newBlog]);
        message.success("Blog added successfully!");
      } catch (error) {
        console.error("Error adding blog:", error);
        message.error("Failed to add blog");
      }
    }
  
    setIsModalVisible(false);
    form.resetFields();
    setEditMode(false);
  };
  
  // const handleEditBlog = (blog) => {
  //   setEditMode(true);
  //   setCurrentBlog(blog);
  //   setIsModalVisible(true);
  //   form.setFieldsValue({ ...blog, date: moment(blog.date) });
  // };

  //for connecting backend
  const handleEditBlog = (blog) => {
    setEditMode(true);
    setCurrentBlog(blog);
    setIsModalVisible(true);
    form.setFieldsValue({ ...blog, date: moment(blog.date) });
  };
  
  // const handleDeleteBlog = (id) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to delete this blog?",
  //     onOk: () => {
  //       const updatedBlogs = blogs.filter((blog) => blog.id !== id);
  //       setBlogs(updatedBlogs);
  //       localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
  //       message.success("Blog deleted successfully!");
  //     },
  //   });
  // };

  //for connecting backend
  const handleDeleteBlog = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blog?",
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/blogs/${id}`, { method: "DELETE" });
  
          if (!response.ok) throw new Error("Failed to delete blog");
  
          setBlogs(blogs.filter((blog) => blog._id !== id));
          message.success("Blog deleted successfully!");
        } catch (error) {
          console.error("Error deleting blog:", error);
          message.error("Failed to delete blog");
        }
      },
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 overflow-hidden">
      <Card title="Blog Management" className="w-full max-w-5xl shadow-lg p-6 ">
        <div className="flex justify-between items-center mb-4">
          <Button type="primary" onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />} className="text-lg px-6 py-2">
            Add Blog
          </Button>
        </div>
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No blogs available.</p>
        ) : (
          <Table
  columns={[
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Content", dataIndex: "content", key: "content" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image && <img src={image} alt="Blog" className="w-28 h-20 object-cover rounded-md shadow-sm" />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} className="text-xl" onClick={() => handleEditBlog(record)} />
          <Button type="link" icon={<DeleteOutlined />} className="text-xl" onClick={() => handleDeleteBlog(record._id)} danger />
        </>
      ),
    },
  ]}
  dataSource={blogs}
  rowKey="_id" // Use MongoDB _id as key
  pagination={{ pageSize: 5 }}
  className="text-lg"
  scroll={{ y: 400 }}
/>
        )}
      </Card>
      <Modal
        title={editMode ? "Edit Blog" : "Add Blog"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdateBlog}>
          <Form.Item name="title" label="Blog Title" rules={[{ required: true, message: "Please enter a title" }]}>
            <Input className="text-lg" />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true, message: "Please enter the author's name" }]}>
            <Input className="text-lg" />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}>
            <DatePicker className="text-lg w-full" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="content" label="Blog Content" rules={[{ required: true, message: "Please enter content" }]}>
            <Input.TextArea rows={4} className="text-lg" />
          </Form.Item>
          <Form.Item name="image" label="Blog Image">
  <Upload
    fileList={currentBlog?.image ? [{ uid: '-1', url: currentBlog.image, name: 'uploaded_image' }] : []}
    showUploadList={true} // Allow showing the uploaded image
    beforeUpload={(file) => {
      const reader = new FileReader();
      reader.onload = (e) => form.setFieldsValue({ image: e.target.result });
      reader.readAsDataURL(file);
      return false; // Prevent automatic upload
    }}
    listType="picture-card"
  >
    <Button icon={<UploadOutlined />} className="text-lg">Upload Image</Button>
  </Upload>
</Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="text-lg px-6 py-2 w-full">
              {editMode ? "Update Blog" : "Add Blog"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
