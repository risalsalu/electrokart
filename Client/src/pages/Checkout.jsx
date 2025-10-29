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
  const grandTotal = cartTotal;

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
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.product?.id || item.productId,
          quantity: item.quantity,
        })),
      };
      const created = await placeOrder(orderData);
      const createdOrder = created?.data ?? created;
      const orderId = createdOrder?.orderId ?? createdOrder?.id;
      if (!orderId) {
        toast.error("Failed to create order");
        return;
      }

      if (paymentMethod === "COD") {
        toast.success("Order placed successfully (COD)");
        clearCart();
        navigate("/orders");
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
        payData.paymentId ||
        payData.razorpayOrderId ||
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
          const confirm = await paymentService.confirmPayment({
            paymentId: response.razorpay_payment_id,
            orderId,
          });
          if (confirm?.success) {
            toast.success("Payment successful");
            clearCart();
            navigate("/orders");
          } else {
            toast.error("Payment confirmation failed");
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
      toast.error(err?.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      {cart.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter full shipping address"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Razorpay"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                  />
                  Razorpay (Online Payment)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className={`w-full py-4 rounded-lg text-lg font-semibold ${
                processing
                  ? "bg-gray-400"
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

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id || item.productId}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
