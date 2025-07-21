import React, { useEffect, useRef } from "react";
import { useOrders } from "../Context/OrdersContext";
import { useAuth } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Orders() {
  const { user } = useAuth();
  const { orders, removeItemFromOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();

  const hasShownToast = useRef(false);

  // ✅ Show toast only once after placing an order
  useEffect(() => {
    if (location.state?.orderPlaced && !hasShownToast.current) {
      toast.success("Order placed successfully!");
      hasShownToast.current = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // ✅ If user is not logged in
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Unauthorized</h1>
        <p className="text-lg mb-6">Please log in to view your orders.</p>
        <a
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // ✅ If no orders
  if (!orders.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <p className="text-lg mb-6">You haven't placed any orders yet.</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
          onClick={() => navigate("/products")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Orders List */}
        <div className="flex-grow space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
                <div>
                  <div className="font-semibold text-lg">Order #{order.id}</div>
                  <div className="text-gray-500 text-sm">
                    Placed on{" "}
                    {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`inline-block px-4 py-1 rounded-full font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-50 text-green-600"
                      : order.status === "Cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {order.status || "Processing"}
                </span>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mb-4">
                  <div className="font-medium mb-2">Shipping Address:</div>
                  <div className="text-gray-500">{order.shippingAddress}</div>
                </div>
              )}

              {/* Items */}
              <div className="mb-6 space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">${item.price.toFixed(2)}</div>
                    <button
                      onClick={() => {
                        removeItemFromOrder(order.id, index);
                        toast(`Removed ${item.name} from order`, { icon: "🗑️" });
                      }}
                      className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      aria-label={`Remove ${item.name}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end font-bold text-lg">
                Total: ${order.total?.toFixed(2) || calculateTotal(order.items).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            {orders.map((order) => {
              const subtotal = order.total ?? calculateTotal(order.items || []);
              const shippingFee = 0;
              const tax = 0;
              const grandTotal = subtotal + shippingFee + tax;

              return (
                <div
                  key={order.id}
                  className="mb-6 border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="mb-2 font-semibold">Order #{order.id} Summary</div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (0%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 text-lg font-semibold text-gray-800">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateTotal(items = []) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export default Orders;
