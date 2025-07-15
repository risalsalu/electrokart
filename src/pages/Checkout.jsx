import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart, user, clearCart, placeOrder }) {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const navigate = useNavigate();

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? 9.99 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingFee + tax;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!shippingAddress) {
      alert('Please enter a shipping address');
      return;
    }

    if (!user) {
      alert('You must be logged in to place an order');
      navigate('/login');
      return;
    }

    const newOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      status: 'delivered',
      shippingAddress,
      paymentMethod,
      items: [...cart],
      total: parseFloat(grandTotal.toFixed(2)),
    };

    placeOrder(newOrder);
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-5">Shipping Address</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Address</label>
                <textarea
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your full shipping address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-5">Payment Method</h2>
              <div className="space-y-3">
                {['credit_card', 'paypal', 'cod'].map((method) => (
                  <div className="flex items-center" key={method}>
                    <input
                      type="radio"
                      id={method}
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={method} className="ml-3 block text-gray-700 font-medium">
                      {method === 'cod' ? 'Cash on Delivery' : method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 ease-in-out transform hover:shadow-md"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Order Summary</h2>

          <div className="mb-6 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div className="text-gray-600">{item.name} × {item.quantity}</div>
                <div className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-800">${shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-800">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-4 border-t border-gray-200">
              <span className="text-gray-700">Total</span>
              <span className="text-gray-900">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
