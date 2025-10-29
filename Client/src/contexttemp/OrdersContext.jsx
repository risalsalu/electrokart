import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import orderService from "../services/orderService";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderData) => {
    try {
      if (!orderData || !Array.isArray(orderData.items)) {
        toast.error("Invalid order data");
        return;
      }
      const invalidItems = orderData.items.filter(
        (item) => !item.productId || item.productId <= 0
      );
      if (invalidItems.length > 0) {
        toast.error("Some items have invalid product IDs");
        return;
      }
      setLoading(true);
      const createdOrder = await orderService.createOrder(orderData);
      if (createdOrder) {
        setOrders((prev) => [createdOrder, ...prev]);
        clearCart();
        toast.success("Order placed successfully");
        navigate("/orders");
      } else {
        toast.error("Order creation failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        placeOrder,
        setOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
