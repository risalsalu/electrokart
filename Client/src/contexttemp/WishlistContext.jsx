import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/Wishlist");
      if (res.data?.success) {
        setWishlist(res.data.data || []);
      } else {
        setError(res.data?.message || "Failed to fetch wishlist");
      }
    } catch {
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Please log in to add to wishlist");
      return;
    }
    if (wishlist.some((item) => item.productId === product.id)) {
      toast.error("Product already in wishlist");
      return;
    }
    try {
      const res = await api.post("/Wishlist/add", { productId: product.id });
      if (res.data?.success) {
        toast.success(res.data?.message || "Added to wishlist");
        fetchWishlist();
      } else {
        toast.error(res.data?.message || "Failed to add");
      }
    } catch {
      toast.error("Error adding to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      toast.error("Please log in to remove from wishlist");
      return;
    }
    try {
      const res = await api.delete(`/Wishlist/${productId}`);
      if (res.data?.success) {
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
        toast.success(res.data?.message || "Removed from wishlist");
      } else {
        toast.error(res.data?.message || "Failed to remove");
      }
    } catch {
      toast.error("Error removing from wishlist");
    }
  };

  const isInWishlist = (productId) => wishlist.some((item) => item.productId === productId);
  const clearWishlist = () => setWishlist([]);

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist([]);
  }, [user?.id]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistItemCount: wishlist.length,
        clearWishlist,
        refetchWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
