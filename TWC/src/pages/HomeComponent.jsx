import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const HomeComponent = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col md:flex-row items-center justify-center bg-[#C2BFB0] p-4 md:p-12 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Image Section */}
      <motion.img
        src="https://img.freepik.com/free-photo/mid-century-modern-living-room-interior-design-with-monstera-tree_53876-129805.jpg?ga=GA1.1.1450566916.1738330730&semt=ais_hybrid"
        alt="Explore Furniture"
        className="w-full md:w-1/2 h-auto rounded-lg shadow-lg mb-6 md:mb-0"
        initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
        animate={isInView ? { rotateY: 0, scale: 1, opacity: 1 } : { rotateY: 180, scale: 0.5, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        whileHover={{ scale: 1.05, rotateY: 15, rotateX: 5 }}
      />

      {/* Text + Button Section */}
      <motion.div className="w-full md:w-1/2 text-center md:text-left md:pl-10">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 30, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Discover Our Premium Collection
        </motion.h2>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 px-2 md:px-0"
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 30, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          Explore a variety of modern and elegant furniture designed to match your style and comfort.
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.15,
            backgroundColor: "#3B82F6",
            textShadow: "0px 0px 15px rgba(255, 255, 255, 1)",
            boxShadow: "0px 10px 50px rgba(255, 165, 0, 0.8)",
            rotateX: 10,
            rotateY: 5,
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          whileTap={{ scale: 0.95, rotateX: -10 }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          onClick={() => navigate("/furniture")}
          className="relative px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-black text-base sm:text-lg font-semibold rounded-lg shadow-lg mx-auto md:mx-0"
        >
          <span className="relative z-10">Explore Furniture Products</span>
          <motion.div
            className="absolute inset-0 bg-yellow-400 opacity-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.4 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HomeComponent;
