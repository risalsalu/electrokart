import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const baseURL = 'http://localhost:3002/cart';

  //  Fetch cart items on mount
  useEffect(() => {
    axios.get(baseURL)
      .then((res) => setCart(res.data))
      .catch((err) => console.error('Failed to fetch cart:', err));
  }, []);

  //  Add or update cart item
  const addToCart = async (product, quantity = 1) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      const updatedItem = {
        ...existing,
        quantity: existing.quantity + quantity
      };
      await axios.patch(`${baseURL}/${product.id}`, updatedItem);
      setCart(prev =>
        prev.map(item => item.id === product.id ? updatedItem : item)
      );
    } else {
      const newItem = { ...product, quantity };
      await axios.post(baseURL, newItem);
      setCart(prev => [...prev, newItem]);
    }
  };

  //  Remove from cart
  const removeFromCart = async (id) => {
    await axios.delete(`${baseURL}/${id}`);
    setCart(prev => prev.filter(item => item.id !== id));
  };

  //  Update quantity
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    const item = cart.find(item => item.id === id);
    if (!item) return;

    const updatedItem = { ...item, quantity };
    await axios.patch(`${baseURL}/${id}`, updatedItem);
    setCart(prev =>
      prev.map(item => item.id === id ? updatedItem : item)
    );
  };

  //  Clear entire cart
  const clearCart = async () => {
    const deletePromises = cart.map(item =>
      axios.delete(`${baseURL}/${item.id}`)
    );
    await Promise.all(deletePromises);
    setCart([]);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{  cart,  addToCart,  removeFromCart,  updateQuantity,  clearCart,  cartItemCount  }}  > 
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
