import React from 'react';

function Orders({ orders }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px' }}>Your Orders</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>You haven't placed any orders yet</p>
          <button 
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onClick={() => window.location.href = '/products'}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '20px', 
              marginBottom: '20px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Order #{order.id}</div>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    backgroundColor: 
                      order.status === 'Delivered' ? '#e8f7f0' : 
                      order.status === 'Cancelled' ? '#fceae8' : '#f5f8ff',
                    color: 
                      order.status === 'Delivered' ? '#2ecc71' : 
                      order.status === 'Cancelled' ? '#e74c3c' : '#3498db',
                    padding: '5px 15px',
                    borderRadius: '30px',
                    fontWeight: '500'
                  }}>
                    {order.status}
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: '500', marginBottom: '10px' }}>Shipping Address:</div>
                <div style={{ color: '#7f8c8d' }}>{order.shippingAddress}</div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #f8f9fa' }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      <div style={{ color: '#7f8c8d' }}>Qty: {item.quantity}</div>
                    </div>
                    <div>${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: '600', fontSize: '1.1rem' }}>
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;