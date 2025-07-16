import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const OrdersContext = createContext();
const baseURL = 'http://localhost:3002/orders';

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from JSON Server on mount
  useEffect(() => {
    axios
      .get(baseURL)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(' Error fetching orders:', err));
  }, []);

  // Add new order to JSON Server
  const placeOrder = async (newOrder) => {
    try {
      const res = await axios.post(baseURL, newOrder);
      setOrders((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(' Failed to place order:', err);
    }
  };

  // Remove an item from a specific order
  const removeItemFromOrder = async (orderId, itemIndex) => {
    try {
      const targetOrder = orders.find((order) => order.id === orderId);
      if (!targetOrder) return;

      const newItems = targetOrder.items.filter((_, idx) => idx !== itemIndex);
      const newTotal = newItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      if (newItems.length === 0) {
        //  If order becomes empty, delete it
        await axios.delete(`${baseURL}/${orderId}`);
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      } else {
        //  Update the order
        const updatedOrder = { ...targetOrder, items: newItems, total: newTotal };
        await axios.put(`${baseURL}/${orderId}`, updatedOrder);
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updatedOrder : order))
        );
      }
    } catch (err) {
      console.error(' Failed to update order:', err);
    }
  };

  return (
    <OrdersContext.Provider value={{  orders,  placeOrder,  removeItemFromOrder,  }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
