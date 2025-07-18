import React from 'react';

const Map = () => {
    return (
        <div className="map">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.5978958529495!2d72.50680907558407!3d23.07519897913695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9cb77a69d80f%3A0x52d8b61817c2d54d!2sDream%20Rise!5e0!3m2!1sen!2sin!4v1743619633728!5m2!1sen!2sin"
                width="680"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
            ></iframe>
        </div>
    );
};

export default Map;
