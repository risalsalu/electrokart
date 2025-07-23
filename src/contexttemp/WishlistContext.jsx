import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; 
import { toast } from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const baseURL = "http://localhost:3002/wishlist";

  //  Fetch wishlist for the logged-in user
  const fetchWishlist = async () => {
    try {
      if (!user) {
        setWishlist([]);
        return;
      }

      const res = await axios.get(`${baseURL}?userId=${user.id}`);
      setWishlist(res.data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      toast.error("Failed to fetch wishlist");
    }
  };

  //  Add product to wishlist
  const addToWishlist = async (product) => {
    try {
      if (!user) {
        toast.error("Login to add to wishlist");
        return;
      }

      const alreadyInWishlist = wishlist.some(
        (item) => item.productId === product.id && item.userId === user.id
      );

      if (alreadyInWishlist) {
        toast.error("Already in wishlist");
        return;
      }

      const newItem = {
        ...product,
        productId: product.id,
        userId: user.id,
      };

      const res = await axios.post(baseURL, newItem);
      setWishlist((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Error adding to wishlist");
    }
  };

  //  Remove from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await axios.delete(`${baseURL}/${wishlistItemId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistItemId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Error removing from wishlist");
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.productId === productId);

  const clearWishlist = () => setWishlist([]); 

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistItemCount: wishlist.length,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
