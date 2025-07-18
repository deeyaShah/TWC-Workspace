import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // ✅ for payment redirection
import './CheckoutForm.css';

const Checkout = () => {
  const navigate = useNavigate(); // ✅ Initialize router navigation
  const cartItems = location.state?.cartItems || []; // Access cart data

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [addressId, setAddressId] = useState(null);
  const [viewMode, setViewMode] = useState(false); // 👈 Default is false for first-time

  const validate = () => {
    const newErrors = {};
    if (postalCode.length !== 6) newErrors.postalCode = 'Please enter a 6-digit postal code.';
    if (phoneNumber.length !== 10) newErrors.phoneNumber = 'Please enter a 10-digit phone number.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/address/my-addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data[0];
      if (data) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setAddress(data.address);
        setCity(data.city);
        setPostalCode(data.postalCode);
        setState(data.state);
        setPhoneNumber(data.phoneNumber);
        setAddressId(data._id);
        setViewMode(true); // 👈 Show view mode if address exists
      } else {
        setViewMode(false); // 👈 No address → show blank form
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");
    const newAddress = { firstName, lastName, address, city, postalCode, state, phoneNumber };

    try {
      if (addressId) {
        await axios.put(`http://localhost:5000/api/address/update/${addressId}`, newAddress, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Address updated successfully!");
      } else {
        await axios.post(`http://localhost:5000/api/address/add`, newAddress, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Address saved successfully!");
      }

      fetchAddress(); // Refresh with new/updated data
      setViewMode(true); // Switch to view mode
    } catch (error) {
      toast.error("Failed to save address. Please try again.");
      console.error("Error saving address:", error.response ? error.response.data : error.message);
    }
  };

  const handlePaymentRedirect = () => {
    navigate("/payment", { state: { addressId } }); // Pass addressId to PaymentPage
};

  return (
    <div className="checkout-container">
      {viewMode && addressId ? (
        <div className="address-view">
          <p className="head">Saved Address</p>
          <p><strong>Name:</strong> {firstName} {lastName}</p>
          <p><strong>Address:</strong> {address}, {city}, {state} - {postalCode}</p>
          <p><strong>Phone:</strong> {phoneNumber}</p>

          <div className="checkout-button-group">
            <button className="action-btn" onClick={() => setViewMode(false)}>Edit Address</button>
            <button className="action-btn primary" onClick={handlePaymentRedirect}>Pay Now</button>
          </div>
        </div>
      ) : (
        <form className="checkout-form" onSubmit={handleSubmit}>
          <p className="head">{addressId ? "Edit Address" : "Checkout Form"}</p>

          <div className="name-container">
            <div className="name-field">
              <label>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="name-field">
              <label>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label>Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div>
            <label>City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>

          <div className="state-postal-container">
            <div className="state-field">
              <label>State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>
            <div className="postal-field">
              <label>Postal Code</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              {errors.postalCode && <p className="error">{errors.postalCode}</p>}
            </div>
          </div>

          <div>
            <label>Phone Number</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div>

          <div className="checkout-button-group">
            <button type="submit" className="action-btn">
              {addressId ? 'Update Address' : 'Save & Continue'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;