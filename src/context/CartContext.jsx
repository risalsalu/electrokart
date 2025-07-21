import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth(); // ✅ Use custom hook
  const baseURL = 'http://localhost:3002/cart';

  // ✅ Fetch cart only if user is logged in
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCart([]); // Clear cart if user logs out
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${baseURL}?userId=${user.id}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    try {
      const exists = cart.some(item => item.productId === product.id);
      if (exists) {
        toast.error(`${product.name} is already in the cart.`);
        return;
      }

      const newItem = {
        ...product,
        productId: product.id,
        quantity,
        userId: user.id, // ✅ Attach user ID
      };

      const res = await axios.post(baseURL, newItem);
      setCart(prev => [...prev, res.data]);
      toast.success(`${product.name} added to cart.`);
    } catch (err) {
      console.error('Add to cart failed:', err);
      toast.error('Something went wrong adding to cart.');
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
    if (!user) return;

    try {
      await Promise.all(
        cart.map(item => axios.delete(`${baseURL}/${item.id}`))
      );
      setCart([]);
    } catch (err) {
      toast.error('Failed to clear cart.');
      console.error(err);
    }
  };

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
