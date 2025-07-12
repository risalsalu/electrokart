import React from 'react';
import { Link } from 'react-router-dom';

function Wishlist({ wishlist, removeFromWishlist, addToCart }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px' }}>Your Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Your wishlist is empty</p>
          <Link 
            to="/products" 
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {wishlist.map(product => (
            <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Product Image
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3498db' }}>${product.price.toFixed(2)}</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#f39c12', marginRight: '5px' }}>★</span>
                    <span>{product.rating}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <button 
                    style={{
                      flex: 1,
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                    onClick={() => addToCart(product)}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                  >
                    Add to Cart
                  </button>
                  <button 
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #e74c3c',
                      color: '#e74c3c',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                    onClick={() => removeFromWishlist(product.id)}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#fdf3f2'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;