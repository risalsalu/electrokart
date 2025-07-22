import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();
const baseURL = 'http://localhost:3002/orders';

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth(); //  Get current user from AuthContext

  // Fetch only current user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        return;
      }

      try {
        const res = await axios.get(`${baseURL}?userId=${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [user]);

  // Place a new order with current user's ID
  const placeOrder = async (newOrder) => {
    if (!user?.id) return;

    const orderWithUser = {
      ...newOrder,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post(baseURL, orderWithUser);
      setOrders((prevOrders) => [res.data, ...prevOrders]);
    } catch (err) {
      console.error('Failed to place order:', err);
    }
  };

  // Remove item from a user's order
  const removeItemFromOrder = async (orderId, itemIndex) => {
    try {
      const targetOrder = orders.find((order) => order.id === orderId);

      // Only proceed if the order exists and belongs to current user
      if (!targetOrder || targetOrder.userId !== user?.id) return;

      const newItems = targetOrder.items.filter((_, idx) => idx !== itemIndex);
      const newTotal = newItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      if (newItems.length === 0) {
        //  No items left – delete the order
        await axios.delete(`${baseURL}/${orderId}`);
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      } else {
        const updatedOrder = { ...targetOrder, items: newItems, total: newTotal };
        await axios.put(`${baseURL}/${orderId}`, updatedOrder);
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updatedOrder : order))
        );
      }
    } catch (err) {
      console.error('Failed to update or delete order:', err);
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, removeItemFromOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

//  Custom hook
export const useOrders = () => useContext(OrdersContext);
