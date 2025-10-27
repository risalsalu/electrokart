import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; 
import { toast } from "react-hot-toast";

// ---------------- Create Wishlist Context ----------------
const WishlistContext = createContext();

// ---------------- Wishlist Provider ----------------
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const baseURL = "http://localhost:7289/api/Wishlist"; // Backend API base

  // ---------------- Fetch Wishlist ----------------
  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(baseURL, {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 5000,
      });

      if (res.data?.success) {
        setWishlist(res.data.data || []);
      } else {
        setWishlist([]);
        toast.error(res.data?.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlist([]);
      toast.error("Failed to fetch wishlist. Check your network or backend.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Add to Wishlist ----------------
  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Login to add to wishlist");
      return;
    }

    if (wishlist.some((item) => item.productId === product.id)) {
      toast.error("Product already in wishlist");
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/add`,
        { productId: product.id },
        { headers: { Authorization: `Bearer ${user.token}` }, timeout: 5000 }
      );

      if (res.data?.success) {
        setWishlist((prev) => [...prev, res.data.data]);
        toast.success(res.data?.message || "Added to wishlist");
      } else {
        toast.error(res.data?.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Error adding to wishlist. Check your network/backend.");
    }
  };

  // ---------------- Remove from Wishlist ----------------
  const removeFromWishlist = async (productId) => {
    if (!user) {
      toast.error("Login to remove from wishlist");
      return;
    }

    try {
      const res = await axios.delete(`${baseURL}/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        timeout: 5000,
      });

      if (res.data?.success) {
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
        toast.success(res.data?.message || "Removed from wishlist");
      } else {
        toast.error(res.data?.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Error removing from wishlist. Check your network/backend.");
    }
  };

  // ---------------- Helpers ----------------
  const isInWishlist = (productId) =>
    wishlist.some((item) => item.productId === productId);

  const clearWishlist = () => setWishlist([]);

  // ---------------- Fetch on User Change ----------------
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
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

// ---------------- Custom Hook ----------------
export const useWishlist = () => useContext(WishlistContext);
