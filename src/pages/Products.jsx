import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Products = ({ addToCart, addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const location = useLocation();
  console.log('Products component rendering');

  // If products are passed as props (from App.jsx), use them directly
  // Otherwise fetch from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:3001/products';
        
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        
        if (category) {
          url += `?category=${category}`;
          setCategoryFilter(category);
        }

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category === categoryFilter);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500">
      Error loading products: {error}
    </div>
  );

  if (!products || products.length === 0) {
    return <div className="p-4 text-center">No products available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-4 py-2 rounded-full ${categoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All Products
        </button>
        <button
          onClick={() => setCategoryFilter('mobile')}
          className={`px-4 py-2 rounded-full ${categoryFilter === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Mobile Phones
        </button>
        <button
          onClick={() => setCategoryFilter('laptop')}
          className={`px-4 py-2 rounded-full ${categoryFilter === 'laptop' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Laptops
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
              <Link to={`/products/${product.id}`}>
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="text-gray-500">No image</div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => addToWishlist(product)}
                    className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;