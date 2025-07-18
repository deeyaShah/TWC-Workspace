import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Divider,
  Space,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const KitchenFormModal = ({
  visible,
  onClose,
  onFinish,
  initialValues = {},
  subcategory,
}) => {
  const [form] = Form.useForm();
  const [mainImage, setMainImage] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...initialValues,
        subcategory,
        additionalImages: initialValues?.additionalImages || [],
      });

      // Handle edit mode for main image
      if (initialValues?.image) {
        setMainImage([
          {
            uid: "-1",
            name: "main-image.png",
            status: "done",
            url: initialValues.image,
          },
        ]);
      } else {
        setMainImage([]);
      }

      // Handle edit mode for additional images
      if (initialValues?.additionalImages?.length > 0) {
        setAdditionalImages(initialValues.additionalImages);
      } else {
        setAdditionalImages([]);
      }
    } else {
      form.resetFields();
      setMainImage([]);
      setAdditionalImages([]);
    }
  }, [visible, initialValues, subcategory, form]);

  const handleMainImageChange = ({ fileList }) => {
    setMainImage(fileList.slice(-1)); // Only keep the latest one
  };

  const handleAddAdditionalImage = () => {
    setAdditionalImages([...additionalImages, { url: "", text: "" }]);
  };

  const handleAdditionalChange = (index, field, value) => {
    const updated = [...additionalImages];
    updated[index][field] = value;
    setAdditionalImages(updated);
  };

  const handleRemoveAdditionalImage = (index) => {
    const updated = [...additionalImages];
    updated.splice(index, 1);
    setAdditionalImages(updated);
  };

  const handleSubmit = async (values) => {
    let mainImageUrl = "";

    if (mainImage.length > 0) {
      if (mainImage[0].originFileObj) {
        mainImageUrl = await getBase64(mainImage[0].originFileObj);
      } else {
        mainImageUrl = mainImage[0].url;
      }
    }

    // Validate additional images
    for (let img of additionalImages) {
      if (!img.url || !img.text) {
        return message.error("Please fill all additional image fields.");
      }
    }

    onFinish({
      ...initialValues,
      ...values,
      image: mainImageUrl,
      additionalImages,
    });
  };

  return (
    <Modal
      open={visible}
      title={
        <div className="text-xl font-semibold text-gray-800">
          {initialValues?.id ? "Edit Kitchen" : "Add Kitchen"}
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={800}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="name" label="Kitchen Name" rules={[{ required: true }]}>
            <Input placeholder="Enter kitchen name" />
          </Form.Item>

          <Form.Item label="Subcategory">
            <Input value={subcategory} readOnly />
          </Form.Item>
        </div>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} placeholder="Enter kitchen description..." />
        </Form.Item>

        <Divider orientation="left">Main Image</Divider>

        <Upload
          listType="picture-card"
          fileList={mainImage}
          onChange={handleMainImageChange}
          beforeUpload={() => false}
        >
          {mainImage.length >= 1 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>

        <Divider orientation="left">Additional Images</Divider>

        {additionalImages.map((item, index) => (
          <Space key={index} direction="vertical" className="w-full mb-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Image URL"
                value={item.url}
                onChange={(e) =>
                  handleAdditionalChange(index, "url", e.target.value)
                }
              />
              <Input
                placeholder="Image Description"
                value={item.text}
                onChange={(e) =>
                  handleAdditionalChange(index, "text", e.target.value)
                }
              />
            </div>
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveAdditionalImage(index)}
            >
              Remove
            </Button>
          </Space>
        ))}

        <Button type="dashed" onClick={handleAddAdditionalImage} className="mb-6">
          <PlusOutlined /> Add Additional Image
        </Button>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" className="px-10 py-1.5 text-base">
            {initialValues?.id ? "Update Kitchen" : "Add Kitchen"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default KitchenFormModal;
