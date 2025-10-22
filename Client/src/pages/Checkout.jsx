import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Checkout({ cart, user, clearCart, placeOrder }) {
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? 0.00 : 0; 
  const tax = cartTotal * 0.0; 
  const grandTotal = cartTotal + shippingFee + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to place an order');
      navigate('/login');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    const newOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      status: 'Pending',
      customerName,
      shippingAddress,
      email,
      phone,
      paymentMethod,
      items: [...cart],
      subtotal: parseFloat(cartTotal.toFixed(2)),
      shipping: parseFloat(shippingFee.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(grandTotal.toFixed(2)),
      userId: user.id,
    };

    try {
      await placeOrder(newOrder);
      clearCart();
toast.success('Order placed successfully!');
navigate('/orders');

    } catch  {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-5">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (123) 456-7890"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-5">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Address</label>
                    <textarea
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street address, apartment, floor, etc."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-5">Payment Method</h2>
                <div className="space-y-3">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition">
                    <input
                      type="radio"
                      id="credit_card"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="credit_card" className="ml-3 block text-gray-700 font-medium">
                      Credit Card
                    </label>
                  </div>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="paypal" className="ml-3 block text-gray-700 font-medium">
                      PayPal
                    </label>
                  </div>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="cod" className="ml-3 block text-gray-700 font-medium">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 ease-in-out transform hover:shadow-md hover:scale-[1.01] active:scale-100"
                disabled={cart.length === 0}
              >
                Place Order - ${grandTotal.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Order Summary</h2>

            <div className="mb-6 space-y-4 max-h-64 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium">{item.name}</div>
                      <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-gray-800 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
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
                <span className="text-gray-600">Tax (0%)</span>
                <span className="text-gray-800">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-4 border-t border-gray-200">
                <span className="text-gray-700">Total</span>
                <span className="text-gray-900">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Need help?</h3>
              <p className="text-sm text-blue-700">
                Contact us at <span className="font-medium">support@example.com</span> or call{' '}
                <span className="font-medium">+1 (800) 123-4567</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;