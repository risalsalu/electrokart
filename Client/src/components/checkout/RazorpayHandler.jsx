import React, { useEffect } from "react";
import toast from "react-hot-toast";
import paymentService from "../services/paymentService";

const RazorpayHandler = ({ order, user, clearCart, navigate }) => {
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    if (!order) return;

    const initiatePayment = async () => {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      try {
        const payRes = await paymentService.initiatePayment({
          orderId: order.orderId,
          amount: order.amount,
          currency: "INR",
          description: `Payment for Order #${order.orderId}`,
        });

        if (!payRes?.success || !payRes?.data) {
          toast.error("Payment initiation failed");
          return;
        }

        const payData = payRes.data;
        console.log("Initiated Razorpay order:", payData);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RSuBsN4XbXHsUI",
          amount: (Number(order.amount) || 0) * 100,
          currency: payData.currency || "INR",
          name: "ElectroKart",
          description: `Payment for order #${order.orderId}`,
          order_id:
            payData.paymentId ||
            payData.razorpayOrderId ||
            payData.id ||
            payData.orderId,
          handler: async (response) => {
            console.log("Razorpay response:", response);
            try {
              const confirm = await paymentService.confirmPayment({
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderId: order.orderId,
              });

              if (confirm?.success) {
                toast.success("Payment successful");
                clearCart();
                navigate("/orders");
              } else {
                toast.error(confirm?.message || "Payment confirmation failed");
              }
            } catch {
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
        console.error("Payment error:", err);
        toast.error(err?.message || "Payment failed");
      }
    };

    initiatePayment();
  }, [order, navigate, clearCart]);

  return null;
};

export default RazorpayHandler;
