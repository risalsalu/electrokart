import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail({ products, addToCart, addToWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        className="flex items-center gap-1 text-blue-500 mb-5 hover:text-blue-600 transition-colors"
        onClick={() => navigate(-1)}
      >
        <span>←</span> Back to Products
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="max-h-96 object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          ) : (
            <div className="text-gray-500">No image available</div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-5">
            <div className="flex mr-3">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-xl ${
                    i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500">({product.rating})</span>
          </div>
          
          <p className="text-2xl font-bold text-blue-500 mb-5">
            ${product.price.toFixed(2)}
          </p>
          
          <p className="text-gray-700 mb-8">
            {product.description}
          </p>
          
          <div className="mb-8 space-y-2">
            <p><strong className="font-medium">Category:</strong> {product.category}</p>
            <p>
              <strong className="font-medium">Availability:</strong> 
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? ` In Stock (${product.stock} available)` : ' Out of Stock'}
              </span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button 
                className="bg-gray-50 w-10 h-10 text-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 text-center border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                className="bg-gray-50 w-10 h-10 text-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
            
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button 
              className="border border-gray-200 hover:bg-gray-50 font-semibold py-2 px-5 rounded-lg transition-colors"
              onClick={() => addToWishlist(product)}
            >
              <span className="text-red-400">♡</span> Wishlist
            </button>
          </div>

          {/* Additional Details Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <ul className="space-y-2">
              {product.tags && (
                <li>
                  <strong>Tags:</strong> {product.tags.join(', ')}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;