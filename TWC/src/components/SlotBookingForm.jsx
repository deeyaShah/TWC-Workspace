import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import './SlotBookingForm.css';

const SlotBookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone || formData.phone.length !== 10) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors."); // ✅ toast for validation
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/slot/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Slot booked successfully!'); // ✅ toast on success
      setFormData({ name: '', email: '', phone: '', date: '', timeSlot: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.message || "Something went wrong."); // ✅ toast on error
    }
  };

  return (
    <div className="container">
      <h2>Slot Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
          {errors.phone && <span>{errors.phone}</span>}
        </div>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          {errors.date && <span>{errors.date}</span>}
        </div>
        <div>
          <label>Time Slot:</label>
          <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
            <option value="">Select Time Slot</option>
            <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
            <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
            <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
            <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
            <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
            <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
          </select>
          {errors.timeSlot && <span>{errors.timeSlot}</span>}
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default SlotBookingForm;