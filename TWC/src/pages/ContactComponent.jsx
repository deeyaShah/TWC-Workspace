import React from 'react';
// import HelpForm from './HelpForm';
import Map from './Map';
// import Footer from './Footer';
import './ContactUs.css'; // Create a CSS file for styling

const ContactComponent = () => {
    return (
        <div className="contact-us">
            <img src="./images/slideBar6.jpeg" alt="Company" className="header-image" />
            
            <div className="contact-details">
                <div className="details">
                <h1 className="title">Get In Touch</h1>
                <div className="contact-item">
                    <h3><strong>Phone</strong></h3>
                    <p>+91 972-390-2367</p>
                </div>

                <div className="contact-item">
                    <h3><strong>Email</strong></h3>
                    <p>thewoodculture21@gmail.com</p>
                </div>
                    
                <div className="contact-item">
                    <h3><strong>Address</strong></h3>
                    <p>106, Dream Rise Complex, Opp. Capital, <br />
                    Science City Road, Sola, Ahmedabad - 380058, <br />
                    Ahmedabad, Gujarat, India 380002
                    </p>
                </div>
                </div>
                <div className="map-container">
                    <Map />
                </div>
            </div>
            {/* <HelpForm /> */}
            {/* <Footer /> */}
        </div>
    );
};

export default ContactComponent;