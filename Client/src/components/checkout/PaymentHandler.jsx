import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import paymentService from "../../services/paymentService";

const PaymentHandler = ({ orderId, amount, onSuccess }) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const initiate = await paymentService.initiatePayment({
        orderId,
        amount,
        currency: "INR",
        description: "ElectroKart Order",
      });

      if (!initiate?.success) {
        toast.error(initiate?.message || "Failed to initiate payment");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RSuBsN4XbXHsUI",
        amount: Math.round((initiate.data.amount || amount) * 100),
        currency: initiate.data.currency || "INR",
        name: "ElectroKart",
        description: initiate.data.description || "Order Payment",
        order_id: initiate.data.paymentId,
        handler: async (response) => {
          try {
            const confirm = await paymentService.confirmPayment({
              paymentId: response.razorpay_payment_id,
              orderId,
            });
            if (confirm?.success) {
              toast.success("Payment successful!");
              onSuccess?.(confirm);
              navigate("/orders");
            } else {
              toast.error(confirm?.message || "Payment confirmation failed");
            }
          } catch {
            toast.error("Payment confirmation failed");
          }
        },
        prefill: {
          name: initiate.data.prefill?.name || "",
          email: initiate.data.prefill?.email || "",
          contact: initiate.data.prefill?.contact || "",
        },
        theme: { color: "#2B6CB0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed or cancelled"));
      rzp.open();
    } catch {
      toast.error("Payment initiation failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      Pay Now ₹{Number(amount).toFixed(2)}
    </button>
  );
};

export default PaymentHandler;
