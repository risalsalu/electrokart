import React from 'react';

function Orders({ orders }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-6">You haven't placed any orders yet</p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            onClick={() => window.location.href = '/products'}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div 
              key={order.id} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
                <div>
                  <div className="font-semibold text-lg">Order #{order.id}</div>
                  <div className="text-gray-500 text-sm">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className={`
                    inline-block px-4 py-1 rounded-full font-medium
                    ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                      order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 
                      'bg-blue-50 text-blue-600'
                    }
                  `}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="font-medium mb-2">Shipping Address:</div>
                <div className="text-gray-500">{order.shippingAddress}</div>
              </div>
              
              <div className="mb-6 space-y-4">
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                      {/* You can replace this with an actual image */}
                      {/* <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> */}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end font-bold text-lg">
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