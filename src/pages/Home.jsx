import React from 'react';
import { Link } from 'react-router-dom';

function Home({ products = [], addToCart = () => {} }) {
  // Safely handle undefined products
  const featuredProducts = Array.isArray(products) ? products.slice(0, 3) : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Hero Section */}
      <div style={{
        backgroundImage: 'url("/images/register-page.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '50vh',
        borderRadius: '12px',
        padding: '60px 20px',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '20px' }}>
          Welcome to ElectroKart
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 30px' }}>
          Discover the latest electronics at unbeatable prices. 
          Quality products with fast delivery to your doorstep.
        </p>
        <Link 
          to="/products" 
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          Shop Now
        </Link>
      </div>
      
      {/* Featured Products */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '30px', textAlign: 'center' }}>
          Featured Products
        </h2>
        
        {featuredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {featuredProducts.map(product => (
              <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)' }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Product Image
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>{product.name}</h3>
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '15px' }}>{product.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3498db' }}>${product.price.toFixed(2)}</span>
                    <button 
                      style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                      }}
                      onClick={() => addToCart(product)}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No featured products available</p>
        )}
      </div>
    </div>
  );
}

export default Home;