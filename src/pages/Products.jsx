import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Products({ products, addToCart, addToWishlist }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full transition-colors ${
              categoryFilter === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => setCategoryFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <Link to={`/products/${product.id}`} className="block">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {/* Replace with actual image */}
                <span className="text-gray-400">Product Image</span>
              </div>
            </Link>
            
            <div className="p-5">
              <Link to={`/products/${product.id}`} className="block">
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-500 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-500">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{product.rating}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button 
                  className="w-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => addToWishlist(product)}
                  aria-label="Add to wishlist"
                >
                  <span className="text-red-400">♡</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;