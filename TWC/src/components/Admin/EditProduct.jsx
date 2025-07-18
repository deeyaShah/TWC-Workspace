import React, { useState } from "react";
import { Form, Input, Button, Upload, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const EditProduct = () => {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        dimensions: [],
        colors: [],
        collections: "",
        material: "",
        images: [
            { url: "https://picsum.photos/150?random=1" },
            { url: "https://picsum.photos/150?random=2" }
        ]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = (info) => {
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSubmit = () => {
        console.log(productData);
        message.success("Product updated successfully");
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Card title="Edit Product" bordered={false} className="w-full max-w-4xl shadow-lg mx-auto mt-8 overflow-hidden">
                <div className="max-h-[80vh] overflow-y-auto p-4">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Product Name" required>
                            <Input name="name" value={productData.name} onChange={handleChange} required />
                        </Form.Item>
                        <Form.Item label="SKU">
                            <Input name="sku" value={productData.sku} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Description" required>
                            <Input.TextArea name="description" value={productData.description} onChange={handleChange} rows={4} required />
                        </Form.Item>
                        <Form.Item label="Price">
                            <Input type="number" name="price" min="0" value={productData.price} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Stock Count">
                            <Input type="number" name="countInStock" min="0" value={productData.countInStock} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Category">
                            <Input name="category" value={productData.category} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Material">
                            <Input name="material" value={productData.material} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Dimensions (comma-separated)">
                            <Input name="dimensions" value={productData.dimensions.join(", ")} onChange={(e) => setProductData({ ...productData, dimensions: e.target.value.split(",").map((d) => d.trim()) })} />
                        </Form.Item>
                        <Form.Item label="Upload Image">
                            <Upload name="file" customRequest={() => {}} onChange={handleImageUpload} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                            <div className="flex gap-4 mt-3">
                                {productData.images.map((image, index) => (
                                    <img key={index} src={image.url} alt="Product" className="w-24 h-24 object-cover rounded-lg shadow-md border border-gray-200" />
                                ))}
                            </div>
                        </Form.Item>
                        <Form.Item className="text-center">
                            <Button type="primary" htmlType="submit" className="w-1/2">
                                Update Product
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default EditProduct;
