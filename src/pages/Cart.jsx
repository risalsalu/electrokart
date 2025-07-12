import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, removeFromCart, updateQuantity }) {
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = cart.length > 0 ? 9.99 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingFee + tax;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px' }}>Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Your cart is empty</p>
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
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          {/* Cart Items */}
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', padding: '20px', borderBottom: '1px solid #eee', gap: '20px' }}>
                <div style={{ width: '120px', height: '120px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}></div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>{item.name}</h3>
                  <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>${item.price.toFixed(2)}</p>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button 
                        style={{
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e0e0e0',
                          width: '30px',
                          height: '30px',
                          cursor: 'pointer'
                        }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        style={{
                          width: '50px',
                          height: '30px',
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
                          width: '30px',
                          height: '30px',
                          cursor: 'pointer'
                        }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        padding: '0 10px'
                      }}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: '600' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '25px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>Order Summary</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Shipping</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.1rem', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              style={{
                display: 'block',
                backgroundColor: '#3498db',
                color: 'white',
                textAlign: 'center',
                padding: '15px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;