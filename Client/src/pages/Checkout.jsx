import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../contexttemp/OrdersContext";
import { useCart } from "../contexttemp/CartContext";
import { useAuth } from "../contexttemp/AuthContext";
import toast from "react-hot-toast";
import paymentService from "../services/paymentService";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [razorLoaded, setRazorLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorLoaded(true);
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const cartTotal = cart.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const shippingFee = cartTotal > 1000 ? 0 : 49;
  const tax = 0;
  const grandTotal = cartTotal + shippingFee + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error("Enter shipping address");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setProcessing(true);

      const orderData = {
        shippingAddress,
        paymentMethod: paymentMethod === "Razorpay" ? "Online" : "COD",
        items: cart.map((item) => ({
          productId: item.product?.id || item.productId,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await placeOrder(orderData);
      const orderId = createdOrder?.orderId;
      if (!orderId) {
        toast.error("Failed to create order");
        return;
      }

      if (paymentMethod === "COD") {
        toast.success("Order placed successfully (COD)");
        clearCart();
        navigate("/orders", { state: { orderPlaced: true } });
        return;
      }

      if (!razorLoaded || !window.Razorpay) {
        toast.error("Payment gateway not loaded");
        return;
      }

      const amount = createdOrder?.totalAmount ?? grandTotal;
      const payRes = await paymentService.initiatePayment({
        orderId,
        amount,
        currency: "INR",
        description: `Payment for Order #${orderId}`,
      });

      if (!payRes?.success || !payRes?.data) {
        toast.error("Payment initiation failed");
        return;
      }

      const payData = payRes.data;
      const razorOrderId =
        payData.razorpayOrderId ||
        payData.paymentId ||
        payData.id ||
        payData.orderId;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RSuBsN4XbXHsUI",
        amount: (Number(amount) || 0) * 100,
        currency: payData.currency || "INR",
        name: "ElectroKart",
        description: `Payment for order #${orderId}`,
        order_id: razorOrderId,
        handler: async (response) => {
          try {
            // ✅ Send Razorpay ORDER ID to backend (not payment id)
            const confirm = await paymentService.confirmPayment({
              paymentId: response.razorpay_order_id,
              orderId: orderId.toString(),
            });

            if (confirm?.success) {
              toast.success("✅ Payment successful! Redirecting to orders...");
              clearCart();
              setTimeout(() => {
                navigate("/orders", { state: { orderPlaced: true } });
              }, 1200);
            } else {
              toast.error(confirm?.message || "Payment confirmation failed");
            }
          } catch (err) {
            console.error("Payment confirm error:", err);
            toast.error("Payment confirmation error");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
        },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed or cancelled"));
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Checkout
      </h1>
      {cart.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <form
          onSubmit={handlePlaceOrder}
          className="grid lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Shipping Address
              </h2>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter full shipping address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                rows={4}
              />
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-blue-600"
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-3 text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="Razorpay"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                    className="accent-green-600"
                  />
                  Razorpay (Online Payment)
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={processing}
              className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors duration-300 ${
                processing
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : paymentMethod === "COD"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {processing
                ? "Processing..."
                : paymentMethod === "COD"
                ? `Place Order – ₹${grandTotal.toFixed(2)}`
                : `Pay Online – ₹${grandTotal.toFixed(2)}`}
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto border-b border-gray-200 pb-4">
              {cart.map((item) => (
                <div
                  key={item.id || item.productId}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? "₹0.00" : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
