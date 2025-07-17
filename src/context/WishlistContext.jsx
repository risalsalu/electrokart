import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const baseURL = 'http://localhost:3002/wishlist';

  // Load wishlist from JSON server
  const fetchWishlist = async () => {
    try {
      const response = await axios.get(baseURL);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      const exists = wishlist.some((item) => item.id === product.id);
      if (exists) return;

      const response = await axios.post(baseURL, product);
      setWishlist((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (id) => {
    try {
      // Optimistically update UI first
      setWishlist((prev) => prev.filter((item) => item.id !== id));

      // Then sync with server
      await axios.delete(`${baseURL}/${id}`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Total items
  const wishlistItemCount = wishlist.length;

  // Load data on first render
  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        wishlistItemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
