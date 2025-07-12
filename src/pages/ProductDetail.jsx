import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail({ products, addToCart, addToWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Product not found</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <button 
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#3498db',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
        onClick={() => navigate(-1)}
      >
        ← Back to Products
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Product Image */}
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Product Image
        </div>
        
        {/* Product Details */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', marginRight: '15px' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < Math.floor(product.rating) ? '#f39c12' : '#ddd' }}>★</span>
              ))}
            </div>
            <span style={{ color: '#7f8c8d' }}>({product.rating})</span>
          </div>
          
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3498db', marginBottom: '20px' }}>
            ${product.price.toFixed(2)}
          </p>
          
          <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
            {product.description}
          </p>
          
          <div style={{ marginBottom: '30px' }}>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: '60px',
                  height: '40px',
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  borderLeft: 'none',
                  borderRight: 'none'
                }}
              />
              <button 
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
            
            <button 
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '0 25px',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onClick={() => addToCart(product, quantity)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Add to Cart
            </button>
            
            <button 
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #e0e0e0',
                padding: '0 20px',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onClick={() => addToWishlist(product)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ♡ Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;