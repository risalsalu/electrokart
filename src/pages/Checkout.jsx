import React, { useState } from 'react';

function Checkout({ cart, placeOrder }) {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = cart.length > 0 ? 9.99 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingFee + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder({
      items: [...cart],
      total: grandTotal,
      shippingAddress
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>Shipping Address</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Address</label>
                <textarea
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your full shipping address"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
            </div>
            
            {/* Payment Method */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>Payment Method</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    style={{ marginRight: '10px' }}
                  />
                  <label htmlFor="credit_card" style={{ fontWeight: '500' }}>Credit Card</label>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    id="paypal"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    style={{ marginRight: '10px' }}
                  />
                  <label htmlFor="paypal" style={{ fontWeight: '500' }}>PayPal</label>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ marginRight: '10px' }}
                  />
                  <label htmlFor="cod" style={{ fontWeight: '500' }}>Cash on Delivery</label>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                marginTop: '20px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Place Order
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '25px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>Order Summary</h2>
          
          <div style={{ marginBottom: '20px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  {item.name} × {item.quantity}
                </div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
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
        </div>
      </div>
    </div>
  );
}

export default Checkout;