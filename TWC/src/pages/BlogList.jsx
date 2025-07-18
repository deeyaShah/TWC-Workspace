import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        setBlogPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogPosts([]);
      }
    };
    fetchBlogs();
  }, []);

  const rows = [];
  if (Array.isArray(blogPosts) && blogPosts.length > 0) {
    for (let i = 0; i < blogPosts.length; i += 2) {
      rows.push(blogPosts.slice(i, i + 2));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-0 mt-[-25px] sm:mt-0">
      {/* Hero Section */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] relative">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1920"
          alt="Blog Header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold text-center mt-[650px]">Our Blog</h1>
        </div>
      </div>

      {/* Blog Content */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-16">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-col md:flex-row md:justify-between md:gap-6"
            >
              {row.map((post) => (
                <div
                  key={post._id}
                  className="w-full md:w-[500px] mb-10 md:mb-0 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-5 text-base sm:text-lg line-clamp-4 min-h-[96px]">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blogs/${post._id}`}
                      className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-base sm:text-lg"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}

              {/* Maintain layout spacing for single card rows on desktop */}
              {row.length === 1 && <div className="hidden md:block w-[500px]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
