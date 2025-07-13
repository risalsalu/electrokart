import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!query.trim()) {
      navigate('/products');
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/products?q=${query}`
        );
        setProducts(response.data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to load search results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate]);

  // Loading state
  if (loading) return (
    <div className="p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
      <p>Searching products...</p>
    </div>
  );

  // Error state
  if (error) return (
    <div className="p-8 text-center">
      <div className="text-red-500 mb-2">⚠️ Error</div>
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {products.length} results for "{query}"
      </h1>
      
      {/* Empty state */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <img src="/no-results.png" className="mx-auto w-40 mb-4" alt="No results" />
          <h3 className="text-xl font-medium">No products found</h3>
          <p>Try different keywords like "laptop" or "mobile"</p>
        </div>
      )}

      {/* Results grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;