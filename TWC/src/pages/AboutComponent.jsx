//--------------------Todayyyyyyyyyyyyyyyyyy
import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebookF } from "react-icons/fa";;

const AboutComponent = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-[#EDE6DD] overflow-hidden">
      {/* Image Section with Hover Effect */}
      <motion.div
        className="relative w-full h-[60vh] sm:h-[70vh] flex justify-center items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://images.pexels.com/photos/28272318/pexels-photo-28272318/free-photo-of-a-white-kitchen-with-white-cabinets-and-stainless-steel-appliances.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Modular Kitchen"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10 md:py-16 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="w-full md:w-1/2 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4D3D32] mb-4">ABOUT US</h1>
          <h2 className="text-lg md:text-xl font-semibold text-[#4D3D32] mb-3">About Our Company</h2>
          <p className="text-base md:text-lg text-[#4D3D32] leading-relaxed">
            At The Wood Culture, we are dedicated to transforming spaces into beautiful, functional environments that reflect your unique style and needs. Established in 2021, we have built a reputation for excellence in the modular kitchen and furniture industry, serving countless satisfied customers across Ahmedabad.
          </p>
          <p className="text-base md:text-lg text-[#4D3D32] leading-relaxed mt-4">
            Our journey began with a simple vision: to create high-quality, customizable kitchen and furniture solutions that cater to the diverse lifestyles of our clients.
          </p>
          <button className="mt-6 px-5 py-3 bg-[#4D3D32] text-white font-bold text-base md:text-lg rounded-lg shadow-md hover:bg-[#3A2C24] transition duration-300">
            Learn More
          </button>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
          <img
            src="https://images.pexels.com/photos/28272318/pexels-photo-28272318/free-photo-of-a-white-kitchen-with-white-cabinets-and-stainless-steel-appliances.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Furniture Design"
            className="w-[90%] sm:w-[400px] h-auto shadow-lg rounded-lg"
          />
        </div>
      </motion.div>

      {/* Vision Section */}
      <motion.div
        className="w-full px-6 md:px-12 py-12 md:py-16 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#4D3D32] mb-6 text-center">OUR VISION</h1>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="md:w-1/2 p-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#4D3D32] mb-2">Vision 01</h2>
            <p className="text-base md:text-lg text-[#4D3D32] leading-relaxed">
              We envision a world where every home is a perfect blend of style and functionality. Our goal is to transform ordinary spaces into extraordinary ones.
            </p>
          </div>
          <div className="md:w-1/2 p-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[#4D3D32] mb-2">Vision 02</h2>
            <p className="text-base md:text-lg text-[#4D3D32] leading-relaxed">
              To be the leading brand in sustainable design, crafting eco-friendly modular kitchens and personalized furniture solutions.
            </p>
          </div>
        </div>

        {/* Vision Images */}
        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-6">
          <img src="/images/slideBar5.jpeg" alt="Vision 01" className="w-[90%] sm:w-[300px] md:w-[500px] h-auto shadow-lg rounded-lg" />
          <img src="/images/slideBar1.jpeg" alt="Vision 02" className="w-[90%] sm:w-[300px] md:w-[500px] h-auto shadow-lg rounded-lg" />
        </div>
      </motion.div>

      {/* Mission Section (Added as per your image) */}
      <motion.div
        className="w-full px-6 md:px-12 py-12 md:py-16 max-w-7xl mx-auto bg-[#F6F1EB] rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#4D3D32] mb-6 text-center">OUR MISSION</h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Image on Left */}
          <div className="w-full md:w-1/2">
            <img
              src="/images/slideBar5.jpeg"
              alt="Mission"
              className="w-full h-auto shadow-lg rounded-lg"
            />
          </div>

          {/* Text on Right */}
          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="text-xl md:text-2xl font-semibold text-[#4D3D32] mb-2">Mission 01</h2>
            <p className="text-base md:text-lg text-[#4D3D32] leading-relaxed mb-6">
              Our mission is to provide high-quality, customizable kitchen and furniture solutions that cater to the diverse needs of our clients.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-[#4D3D32] mb-2">Mission 02</h2>
            <p className="text-base md:text-lg text-[#4D3D32] leading-relaxed">
              We lead in sustainable design by offering a diverse range of stylish and eco-conscious solutions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Space between Mission and Our Services Section */}
      <div className="h-1"></div>

      {/* Our Services Section */}
      <motion.div
        className="w-full px-6 md:px-12 py-12 md:py-16 mx-auto bg-[#F6F1EB] rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#4D3D32] mb-8 text-center">
          OUR SERVICES
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Text Column */}
          <div className="md:w-1/2 text-[#4D3D32] space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                1. Custom Modular Kitchen Design
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                We specialize in creating bespoke modular kitchen solutions tailored to your specific space and lifestyle.
              </p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                2. Furniture Design and Manufacturing
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                Our furniture includes a wide variety of styles, providing custom solutions for your kitchen and living spaces.
              </p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                3. 3D Visualization and Planning
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                We offer advanced 3D visualization services to help you see your layouts in a realistic format.
              </p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                4. Sustainable Material Sourcing
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                We prioritize eco-friendly, sustainable materials to protect the planet.
              </p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                5. Installation Service
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                Our professional team handles setup efficiently, so you enjoy a stress-free experience.
              </p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                6. After-Sales Support
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                We offer ongoing maintenance and customer care to ensure long-lasting satisfaction.
              </p>
            </div>
          </div>

          {/* Image Column */}
          <div className="md:w-1/2 flex flex-col items-center gap-6">
            <img
              src="/images/slideBar2.jpeg"
              alt="Service 1"
              className="w-[90%] sm:w-[80%] md:w-[80%] h-auto shadow-lg rounded-lg"
            />
            <img
              src="/images/slideBar5.jpeg"
              alt="Service 2"
              className="w-[90%] sm:w-[80%] md:w-[80%] h-auto shadow-lg rounded-lg"
            />
          </div>
        </div>
      </motion.div>

    {/* trying for design     */}
    <motion.div
        className="w-full px-6 md:px-12 py-12 md:py-16 bg-[#EDE6DD]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#4D3D32] text-center mb-10">
          DESIGN CHOICES FOR YOUR ROOM!
        </h1>

        {/* Image Grid */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          {["slideBar1", "slideBar2", "slideBar3", "slideBar5"].map((img, i) => (
            <img
              key={i}
              src={`/images/${img}.jpeg`}
              alt={`Portfolio ${i + 1}`}
              className="w-[90%] sm:w-[250px] h-auto shadow-lg rounded-lg"
            />
          ))}
        </div>

        {/* Paragraph Grid */}
        <div className="max-w-4xl mx-auto space-y-6 text-[#4D3D32] text-base md:text-lg">
          <p className="text-center bg-white p-6 rounded shadow">
            <strong>Waldrop's:</strong> We prioritize sustainable materials and organic textures, blending timeless appeal with modern trends.
          </p>
          <p className="text-center bg-white p-6 rounded shadow">
            <strong>L-shaped kitchen:</strong> An efficient layout ideal for all room sizes, allowing space for a breakfast bar or island.
          </p>
          <p className="text-center bg-white p-6 rounded shadow">
            <strong>Sofa set:</strong> From modern to classic styles—customize your sofa with your choice of fabric, color, and layout.
          </p>
          <p className="text-center bg-white p-6 rounded shadow">
            <strong>Parallel kitchen:</strong> With two countertops and smart storage, this layout is perfect for compact and efficient cooking.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full px-6 md:px-8 py-12 md:py-16 bg-[#f9f7f3] min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800">OUR VALUES</h2>
          <p className="text-base md:text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
            At The Wood Culture, our values guide our work and relationships—with our clients, our team, and our community.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-gray-900 w-full max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {[
            {
              title: "Integrity",
              text: "We stand firm on honesty and transparency. We uphold ethical practices in everything we do.",
            },
            {
              title: "Innovation",
              text: "We are the architects of creativity, constantly pushing boundaries in design and solutions.",
            },
            {
              title: "Sustainability",
              text: "Our practices support the environment and future generations through eco-conscious choices.",
            },
            {
              title: "Customer-Centricity",
              text: "Clients are our priority. We listen, adapt, and ensure personalized solutions that exceed expectations.",
            },
          ].map((value, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                {value.title}
              </h3>
              <p className="text-base text-gray-600">{value.text}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

    <div className="w-full bg-[#f9f7f3] py-16 px-6 md:px-20 rounded-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Left - Beautiful Image Full Height */}
            <motion.img
              src="images/slideBar3.jpeg"
              alt="Contact Us"
              className="w-full lg:w-[500px] h-[500px] object-cover rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Right - Contact Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex-1"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                Have questions, suggestions, or just want to say hello? We’d love to hear from you. Our friendly team is here to help!
              </p>

              <div className="space-y-6 text-gray-800">
                <div className="flex items-start gap-4">
                  <FaPhoneAlt className="text-xl text-[#4B5563] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-medium text-gray-800">+91 972-390-2367</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-xl text-[#4B5563] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium text-gray-800">thewoodculture21@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-2xl text-[#4B5563] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-medium text-gray-800 leading-relaxed">
                      106, Dream Rise Complex, Opp. Capital,<br />
                      Science City Road, Sola,<br />
                      Ahmedabad - 380058, Gujarat, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Follow Us</h3>
                <div className="flex flex-col gap-2">
                  <a href="#" className="flex items-center text-blue-700 hover:underline">
                    <FaInstagram className="mr-2 text-2xl" /> Instagram: @the_wood_culture
                  </a>
                  <a href="#" className="flex items-center text-blue-700 hover:underline">
                    <FaFacebookF className="mr-2 text-2xl" /> Facebook: The Wood Culture
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>


        {/* Thank You Section */}
        <div className="mt-1 p-8 bg-[#F7F5F0] rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
          {/* Left Side - Text */}
          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">THANK YOU</h2>
            <p className="text-base text-gray-600 leading-relaxed text-justify">
              In the tapestry of our journey, each thread represents the invaluable contributions of those who have walked alongside us. As we pause to reflect on our achievements, we extend our deepest gratitude to all who have played a pivotal role in our story.
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed text-justify">
              To our esteemed clients, your unwavering trust and visionary aspirations have been the cornerstone of our endeavors. Your partnership fuels our passion for innovation and excellence, inspiring us to transcend boundaries and redefine possibilities. We are profoundly grateful for the opportunity to collaborate with you and bring your dreams to fruition.
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed text-justify">
              To our remarkable team, your dedication, creativity, and relentless pursuit of excellence are the lifeblood of our organization. Each of you embodies the spirit of collaboration and innovation, and it is your collective brilliance that propels us forward. Thank you for your tireless efforts and for making our workplace a vibrant hub of ideas and inspiration.
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed text-justify">
              To our valued partners and stakeholders, your support and belief in our mission have been instrumental in our growth. Together, we have forged pathways to success, and we look forward to continuing this journey hand in hand. Your insights and collaboration enrich our endeavors, and for that, we are sincerely thankful.
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed text-justify">
              As we gaze toward the horizon, we are filled with anticipation for the future. We remain steadfast in our commitment to excellence, innovation, and the cultivation of meaningful relationships. Thank you for being an integral part of our journey. Together, we will continue to create a legacy of success and impact.
            </p>
          </motion.div>
          {/* Right Side - Image */}
          <motion.img
            src="/images/slideBar4.jpeg"
            alt="Thank You"
            className="rounded-lg shadow-md w-full max-w-md h-[500px] object-cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>
    </div>
  );
};

export default AboutComponent;