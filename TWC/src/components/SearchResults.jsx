import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('name');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `https://twc-workspace.onrender.com/api/products/search?name=${searchQuery}`
        );
        setProducts(response.data);

        if (response.data.length > 0) {
          toast.success(`Found ${response.data.length} product(s)!`);
        } else {
          toast.error(`No products found for "${searchQuery}"`);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        toast.error('Failed to fetch products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
  <h2 className="text-3xl font-bold text-center mb-8">
    Search Results for: <span className="text-blue-600">{searchQuery}</span>
  </h2>

  {loading ? (
    <div className="text-center text-lg">Loading...</div>
  ) : products.length === 0 ? (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <img
        src="https://www.svgrepo.com/show/79426/empty-box.svg"
        alt="No Results"
        className="w-40 h-40 mb-6 opacity-70"
      />
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">
        No products found
      </h3>
      <p className="text-gray-500">
        We couldn't find any products matching "
        <span className="text-blue-600 italic">{searchQuery}</span>".
      </p>
      {/* Back to Home Button */}
      <Link to="/" className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all">
        Back to Home
      </Link>

      {/* Try a new search */}
      <div className="mt-6">
        <p className="text-gray-700">Try a new search</p>
        <form className="mt-2 flex justify-center">
          <input
            type="text"
            placeholder="Search for products..."
            className="p-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => window.location.href = `/search?name=${e.target.value}`}
          />
        </form>
      </div>
    </div>
  ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-[1600px] mx-auto px-10">
{products.map((product) => (
  <div
    key={product._id}
    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    <Link to={`/productDetails/${product._id}`}>
      <img
        src={product.images && product.images[0]}
        alt={product.name}
        className="w-full h-56 object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <p className="text-gray-600 mt-1 line-clamp-3">{product.description}</p>
        <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>

        {/* Updated Stock Display */}
        {product.stock <= 0 ? (
          <p className="text-red-500 mt-2">Out of Stock</p>
        ) : product.stock === 1 ? (
          <p className="text-red-500 mt-2">Only 1 left in stock</p>
        ) : null}
      </div>
    </Link>
  </div>
))}
    </div>
  )}
</div>
  );
};

export default SearchResults;
