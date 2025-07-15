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

  // Add item to JSON server wishlist
  const addToWishlist = async (product) => {
    try {
      const exists = wishlist.find((item) => item.id === product.id);
      if (exists) return;

      const response = await axios.post(baseURL, product);
      setWishlist((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // Remove item from JSON server wishlist
  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const wishlistItemCount = wishlist.length;

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, wishlistItemCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
