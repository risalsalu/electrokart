import React, { useEffect } from "react";
import toast from "react-hot-toast";
import paymentService from "../../services/paymentService";

const RazorpayHandler = ({ order, user, clearCart, navigate }) => {
  useEffect(() => {
    if (!window.Razorpay || !order) return;
    const initiatePayment = async () => {
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
            const confirm = await paymentService.confirmPayment({
              paymentId: response.razorpay_payment_id,
              orderId: order.orderId,
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
        toast.error(err?.message || "Payment failed");
      }
    };
    initiatePayment();
  }, [order]);

  return null;
};

export default RazorpayHandler;
