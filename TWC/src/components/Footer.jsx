import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = function () {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-4 text-center md:text-left">
          
          {/* About Us */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              At The Wood Culture, we are dedicated to transforming spaces into beautiful, functional environments that reflect your unique style and needs. Established in 2021, we have built a reputation for excellence in the modular kitchen and furniture industry, serving countless satisfied customers across Ahmedabad.
            </p>
            <a href="/about" className="text-blue-400 hover:underline mt-2 inline-block text-sm">Read More</a>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/blogs" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
              <li><FaEnvelope className="inline mr-2" /> thewoodculture21@gmail.com</li>
              <li><FaPhone className="inline mr-2" /> +91 972-390-2367</li>
              <li><FaMapMarkerAlt className="inline mr-2" />
                106, Dream Rise Complex, Opp. Capital,<br />
                Science City Road, Sola, Ahmedabad - 380058,<br />
                Ahmedabad, Gujarat, India 380002
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-4 flex flex-row justify-center md:justify-end items-center gap-4">
              <a
                href="https://www.instagram.com/@the_wood_culture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-2xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/The Wood Culture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-2xl"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} The Wood Culture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
