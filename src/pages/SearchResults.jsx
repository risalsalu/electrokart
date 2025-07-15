import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q')?.trim() || '';

  useEffect(() => {
    if (!query) {
      navigate('/products');
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setSuggestions([]);
        const response = await axios.get(`http://localhost:3002/products?q=${query}`);
        const results = response.data.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(results);

        if (results.length === 0) {
          const fallbackCategories = ['mobile', 'laptop', 'tv', 'headphone'];
          const fallbackResponses = await Promise.all(
            fallbackCategories.map(cat =>
              axios.get(`http://localhost:3002/products?category=${cat}`)
            )
          );
          const fallbackProducts = fallbackResponses.flatMap(res => res.data.slice(0, 1));
          setSuggestions(fallbackProducts);
        }

      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate]);

  const renderCard = (product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain p-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>Searching products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-2 font-semibold">⚠️ Error</div>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {products.length} result{products.length !== 1 && 's'} for "{query}"
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <img src="/no-results.png" className="mx-auto w-40 mb-4" alt="No results" />
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-gray-500">Try keywords like "laptop", "tv", or "mobile"</p>

          {suggestions.length > 0 && (
            <>
              <h4 className="text-lg font-semibold mt-8 mb-4">You may like:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {suggestions.map(renderCard)}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(renderCard)}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
