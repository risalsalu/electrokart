import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const baseURL = 'http://localhost:3002/cart';

  // ✅ Fetch cart items once on mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(baseURL);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  // ✅ Prevent multiple adds & update cart in sync with backend
  const addToCart = async (product, quantity = 1) => {
    try {
      const res = await axios.get(`${baseURL}/${product.id}`);
      if (res.data) {
        // Product exists – update quantity
        const updatedItem = {
          ...res.data,
          quantity: res.data.quantity + quantity
        };
        await axios.patch(`${baseURL}/${product.id}`, updatedItem);
        setCart(prev =>
          prev.map(item => item.id === product.id ? updatedItem : item)
        );
        toast.success(`${product.name} quantity updated in cart.`);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Product doesn't exist – add new
        const newItem = { ...product, quantity };
        await axios.post(baseURL, newItem);
        setCart(prev => [...prev, newItem]);
        toast.success(`${product.name} added to cart.`);
      } else {
        console.error('Add to cart failed:', err);
        toast.error('Something went wrong adding to cart.');
      }
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      setCart(prev => prev.filter(item => item.id !== id));
      toast.success('Item removed from cart.');
    } catch (err) {
      toast.error('Failed to remove item.');
      console.error(err);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    try {
      const item = cart.find(item => item.id === id);
      if (!item) return;
      const updatedItem = { ...item, quantity };
      await axios.patch(`${baseURL}/${id}`, updatedItem);
      setCart(prev =>
        prev.map(item => item.id === id ? updatedItem : item)
      );
    } catch (err) {
      toast.error('Failed to update quantity.');
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await Promise.all(cart.map(item =>
        axios.delete(`${baseURL}/${item.id}`)
      ));
      setCart([]);
      // toast.success('Cart cleared.');
    } catch (err) {
      toast.error('Failed to clear cart.');
      console.error(err);
    }
  };

  // ✅ Use useMemo to avoid recalculating on every render
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
