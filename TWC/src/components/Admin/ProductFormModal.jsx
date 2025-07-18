import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Divider,
  Rate,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProductFormModal = ({
  visible,
  onClose,
  onFinish,
  initialValues = {},
  subcategory,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...initialValues,
        subcategory,
      });

      // If editing and images exist
      if (initialValues?.images?.length > 0) {
        const formatted = initialValues.images.map((url, index) => ({
          uid: `${-index - 1}`,
          name: `image-${index + 1}.png`,
          status: "done",
          url,
        }));
        setFileList(formatted);
      } else {
        setFileList([]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, initialValues, subcategory, form]);

  const handleChange = ({ fileList: newList }) => setFileList(newList);

  const handleSubmit = async (values) => {
    const images = [];

    for (const file of fileList) {
      if (file.originFileObj) {
        const base64 = await getBase64(file.originFileObj);
        images.push(base64);
      } else if (file.url) {
        images.push(file.url);
      }
    }

    onFinish({ ...initialValues, ...values, images });
  };

  return (
    <Modal
      open={visible}
      title={
        <div className="text-xl font-semibold text-gray-800">
          {initialValues?.id ? "Edit Product" : "Add Product"}
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={750}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item name="sku" label="SKU">
            <Input placeholder="Product SKU" />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} placeholder="₹0.00" />
          </Form.Item>

          <Form.Item name="stock" label="Stock Count">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 10" />
          </Form.Item>

          <Form.Item label="Subcategory">
            <Input value={subcategory} readOnly />
          </Form.Item>
        </div>

        <Divider />

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Short product description..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Upload Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false} // Prevent automatic upload
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="rating" label="Rating">
            <Rate allowHalf />
          </Form.Item>
        </div>

        <Form.Item className="text-center mt-4">
          <Button type="primary" htmlType="submit" className="px-10 py-1.5 text-base">
            {initialValues?.id ? "Update Product" : "Add Product"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;