import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.id}`}>
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
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {product.category === 'mobile' ? 'Phone' : 'Laptop'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;