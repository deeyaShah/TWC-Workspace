import React, { useEffect, useState } from 'react';
import './ModularKitchen.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // <-- Add this

const KitchenDesign = ({ design, onClick }) => (
  <div className="kitchen-design" onClick={onClick}>
    <img src={`/images/${design.images[0]}`} alt={design.title} />
    <h3>{design.title}</h3>
  </div>
);

const DesignDetails = ({ design }) => (
  <div className="design-details">
    <h2>{design.title} Modular Kitchen</h2>

    {/* Description from backend */}
    {/* <p className="static-description">{design.Description}</p> */}

    {/* New Details section */}
    <div className="details-section">
      <h3>Details</h3>
      <p>{design.Details}</p>
    </div>

    {/* Additional images (excluding the first one) */}
    <div className="additional-images">
      {design.images.slice(1).map((img, index) => (
        <div key={index} className="additional-image-container">
          <img src={`/images/${img}`} alt={`${design.title} ${index + 2}`} />
        </div>
      ))}
    </div>
  </div>
);

const ModularKitchen = () => {
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const navigate = useNavigate(); // <-- Hook for navigation


  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await axios.get('https://twc-workspace.onrender.com/Kitchen-Products/api2/v1');
        setDesigns(res.data);
        setSelectedDesign(res.data[0]); // Show first product by default
        toast.success('Kitchen designs loaded successfully!');
      } catch (err) {
        console.error('Failed to fetch kitchen designs:', err);
        toast.error('Failed to load kitchen designs. Please try again later.');
      }
    };

    fetchDesigns();
  }, []);

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
  };

  const handleBookTour = () => {
    toast.success('Redirecting to kitchen tour booking...');
    navigate('/slot'); // <-- This should match the route of your Kitchen Visit Form
  };
  return (
    <div className="App">
      {/* Hero Section */}
      <div className="hero">
        <img src="./images/IMG(hero)_kitchen.jpeg" alt="Modular Kitchen" />
        <div className="overlay">
          <h1>Best Modular Kitchen Designs</h1>
        </div>
      </div>

      {/* Header Section */}
      <div className="header-container">
        <div className="header-content">
          <div className="header-text">
            <h2>Modular Kitchen Designs in Ahmedabad</h2>
            <p>
              The Wood Culture is a leading modular kitchen designer in Ahmedabad, working with your vision, lifestyle, and budget to create the perfect kitchen interior...
            </p>
          </div>
          <div className="header-button">
            <button className="book-tour" onClick={handleBookTour}>
              Book a Kitchen Tour
            </button>
          </div>
        </div>
      </div>

      {/* Kitchen Cards */}
      <h2 className="designs-title">Modular Kitchen Designs</h2>
      <div className="designs-container">
      {designs.map((design) => (
        <div key={design._id} className="kitchen-design-wrapper">
          <KitchenDesign
            design={design}
            onClick={() => handleDesignClick(design)}
          />

          {/* Show details below clicked item on mobile */}
          {selectedDesign?._id === design._id && window.innerWidth <= 768 && (
            <DesignDetails design={design} />
          )}
        </div>
      ))}
      </div>

      {/* Show details at bottom for desktop */}
      {selectedDesign && window.innerWidth > 768 && (
        <DesignDetails design={selectedDesign} />
      )}
    </div>
  );
};

export default ModularKitchen;
