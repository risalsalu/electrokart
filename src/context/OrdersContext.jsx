import { createContext, useContext, useEffect, useState } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem('orders')) || []
  );

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const removeItemFromOrder = (orderId, itemIndex) => {
    setOrders((prevOrders) => {
      return prevOrders
        .map((order) => {
          if (order.id === orderId) {
            const newItems = order.items.filter((_, idx) => idx !== itemIndex);
            const newTotal = newItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );
            return { ...order, items: newItems, total: newTotal };
          }
          return order;
        })
        .filter((order) => order.items.length > 0); // Remove orders with 0 items
    });
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, removeItemFromOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
