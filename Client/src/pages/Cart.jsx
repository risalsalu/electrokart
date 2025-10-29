import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


function Cart({ cart, removeFromCart, updateQuantity, user }) {
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * (item.quantity || 0),
    0
  );
  const shipping = cart.length > 0 ? 0.0 : 0;
  const tax = subtotal * 0.0;
  const total = subtotal + shipping + tax;

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.itemId, item.quantity - 1);
      toast(`Reduced quantity of ${item.productName || item.name}`, { icon: "➖" });
    } else {
      toast.error("Minimum quantity is 1");
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item.itemId, item.quantity + 1);
    toast.success(`Increased quantity of ${item.productName || item.name}`);
  };

  const handleRemove = (item) => {
    removeFromCart(item.itemId);
    toast.error(`${item.productName || item.name} removed from cart`);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }
    toast.success("Redirecting to checkout...");
    navigate("/checkout");
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.itemId}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.productImage || "/placeholder.png"}
                  alt={item.productName || item.name}
                  className="w-16 h-16 object-contain rounded-lg"
                />
                <div>
                  <div className="font-semibold text-lg">
                    {item.productName || item.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    ₹{Number(item.price || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrease(item)}
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item)}
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-500 hover:text-red-700 font-medium ml-3"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (0%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
