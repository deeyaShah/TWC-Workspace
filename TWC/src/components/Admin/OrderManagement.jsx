import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Select, Button, Card, message, Modal, Form, Input } from "antd";
import { v4 as uuidv4 } from 'uuid'; 
const { Option } = Select;

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders/admin/all-orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setOrders(data);
            } catch (error) {
                console.error(error);
                message.error("Failed to fetch orders");
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const { data } = await axios.patch(
                `http://localhost:5000/api/orders/admin/update-status/${orderId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? { ...order, status: data.status } : order
                )
            );
            message.success("Status updated");
        } catch (error) {
            console.error(error);
            message.error("Failed to update status");
        }
    };

    // Update handleOpenTrackingModal to set default tracking ID
    const handleOpenTrackingModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);

        // Auto-generate tracking ID when opening modal
        form.setFieldsValue({
            trackingId: `TRK-${uuidv4().slice(0, 8).toUpperCase()}`, // e.g., TRK-1A2B3C4D
            currentStatus: "In Transit"
        });
    };

    const handleTrackingSubmit = async () => {
        try {
            const values = await form.validateFields();
            await axios.put(
                `http://localhost:5000/api/orders/tracking/${selectedOrderId}`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            // console.log(localStorage.getItem("token"));
            message.success("Tracking information updated");
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error("Failed to update tracking info");
        }
    };

    const columns = [
        {
            title: "Order ID",
            dataIndex: "_id",
            key: "_id",
            render: (id) => `#${id}`,
        },
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <div>
                    <p><strong>Name:</strong> {record.user?.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {record.user?.email || 'N/A'}</p>
                </div>
            ),
        },
        {
            title: "Total Price",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `${price}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    style={{ width: 130 }}
                >
                    <Option value="Pending">Pending</Option>
                    <Option value="Completed">Completed</Option>
                    <Option value="Cancelled">Cancelled</Option>
                </Select>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex flex-col gap-2">
                    <Button
                        type="primary"
                        onClick={() => handleStatusChange(record._id, "Completed")}
                        disabled={record.status === "Completed"}
                    >
                        Mark as Completed
                    </Button>
                    <Button
                        onClick={() => handleOpenTrackingModal(record._id)}
                    >
                        Update Tracking
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 flex justify-center items-center min-h-screen overflow-hidden">
            <Card title="Order Management" className="w-full max-w-7xl shadow-lg p-6">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    scroll={{ y: "55vh" }}
                />
            </Card>

                    <Modal
            title="Update Tracking Info"
            open={isModalOpen}
            onOk={handleTrackingSubmit}
            onCancel={() => {
                setIsModalOpen(false);
                form.resetFields();
            }}
            okText="Update"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="trackingId"
                    label="Tracking ID"
                    rules={[{ required: true, message: "Tracking ID is required" }]}
                >
                    <Input placeholder="Auto-generated" disabled />
                </Form.Item>
                <Form.Item
                    name="currentStatus"
                    label="Current Status"
                    rules={[{ required: true, message: "Please select current status" }]}
                >
                    <Select placeholder="Select status">
                        <Option value="In Transit">In Transit</Option>
                        <Option value="Out for Delivery">Out for Delivery</Option>
                        <Option value="Delivered">Delivered</Option>
                        <Option value="Cancelled">Cancelled</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
        </div>
    );
};

export default OrderManagement;