import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams(); // Get the blog post ID from the URL
  const [post, setPost] = useState(null); // Store fetched post data
  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`); // Replace with your backend API endpoint
        setPost(response.data); // Set fetched post data
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching the blog post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // Fetch data when the component mounts or when the `id` changes

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2 transition-colors duration-300">
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="w-full h-[200px] sm:h-[300px] md:h-[500px] lg:h-[700px] relative overflow-hidden ">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transform scale-105"
        />
      </div>
  
      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-12 md:py-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Post Details */}
          <div className="px-4 sm:px-6 md:px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 font-bold mb-4">
              {post.title}
            </h1>
  
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {/* <span>{new Date(post.date).toDateString()}</span> */}
              </div>
              {/* Uncomment if using read time */}
              {/* <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.readTime}</span>
              </div> */}
            </div>
          </div>
  
          {/* Article Content */}
          <article className="px-4 sm:px-6 md:px-8 py-6">
            <div className="prose max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed text-base sm:text-lg">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </article>
  
          {/* Share Section */}
          <div className="px-4 sm:px-6 md:px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                to="/blogs"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-all duration-300 hover:-translate-x-2"
              >
                <ArrowLeft size={18} />
                Back to Blog
              </Link>
  
              <button className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105">
                <Share2 size={18} />
                Share Article
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default BlogPost;
