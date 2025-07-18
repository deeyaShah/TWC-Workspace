import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, message, Table, Tag } from 'antd';
import { CheckOutlined, DeleteOutlined, ClockCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const KitchenServiceAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestModal, setSuggestModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [suggestedTime, setSuggestedTime] = useState('');

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch('https://twc-workspace.onrender.com/api/slot/admin/all');
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Accept booking
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`https://twc-workspace.onrender.com/api/slot/admin/accept/${id}`, {
        method: 'PUT',
      });
      const data = await res.json();
      message.success(data.message);
      fetchBookings();
    } catch (error) {
      message.error('Failed to accept booking');
    }
  };

  // Open suggest modal
  const openSuggestModal = (id) => {
    setSelectedId(id);
    setSuggestedTime('');
    setSuggestModal(true);
  };

  // Suggest alternative time
  const handleSuggest = async () => {
    try {
      const res = await fetch(`https://twc-workspace.onrender.com/api/slot/admin/suggest/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestedTime }),
      });
      const data = await res.json();
      message.success(data.message);
      setSuggestModal(false);
      fetchBookings();
    } catch (error) {
      message.error('Failed to suggest time');
    }
  };

  // Delete with confirmation
  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this booking?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://twc-workspace.onrender.com/api/slot/admin/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      message.success(data.message);
      fetchBookings();
    } catch (error) {
      message.error('Failed to delete booking');
    }
  };

  // Table columns
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Date', dataIndex: 'date' },
    { title: 'Time Slot', dataIndex: 'timeSlot' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => {
        if (text.startsWith('Suggested')) {
          return <Tag color="orange">{text}</Tag>;
        } else if (text === 'Accepted') {
          return <Tag color="green">Accepted</Tag>;
        }
        return <Tag color="blue">Pending</Tag>;
      },
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            icon={<CheckOutlined />}
            type="primary"
            onClick={() => handleAccept(record._id)}
            disabled={record.status === 'Accepted'}
          >
            Accept
          </Button>
          <Button
            icon={<ClockCircleOutlined />}
            onClick={() => openSuggestModal(record._id)}
            disabled={record.status === 'Accepted'}
          >
            Suggest
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Kitchen Slot Bookings</h2>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 7 }}
        bordered
      />

      {/* Suggest Time Modal */}
      <Modal
        title="Suggest Alternative Time"
        open={suggestModal}
        onOk={handleSuggest}
        onCancel={() => setSuggestModal(false)}
        okText="Send Suggestion"
      >
        <Input
          placeholder="e.g. 2:00 PM - 3:00 PM"
          value={suggestedTime}
          onChange={(e) => setSuggestedTime(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default KitchenServiceAdmin;