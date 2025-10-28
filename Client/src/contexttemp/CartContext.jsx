import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const fetchCartItems = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const res = await api.get("/Cart");
      const cartData = res.data?.data?.items || res.data?.data || [];
      setCart(Array.isArray(cartData) ? cartData : []);
    } catch {
      setCart([]);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) return toast.error("Please log in to add items to your cart.");
    const productId = product?.id || product?.productId;
    if (!productId) return toast.error("Invalid product data.");
    const payload = { productId: Number(productId), quantity: Number(quantity) };
    try {
      const res = await api.post("/Cart/add", payload);
      if (res.data?.success) {
        toast.success(`${product.name || "Product"} added to cart.`);
        fetchCartItems();
      } else {
        toast.error(res.data?.message || "Failed to add to cart.");
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) toast.error("Invalid data sent to server.");
      else if (status === 401) toast.error("Unauthorized. Please log in again.");
      else toast.error("Failed to add to cart.");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/Cart/remove/${itemId}`);
      if (res.data?.success) {
        setCart((prev) => prev.filter((i) => i.itemId !== itemId));
        toast.success("Item removed from cart.");
      } else {
        toast.error(res.data?.message || "Failed to remove item.");
      }
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);
    try {
      const payload = { productId: 0, quantity };
      const res = await api.put(`/Cart/update/${itemId}`, payload);
      if (res.data?.success) {
        setCart((prev) =>
          prev.map((item) =>
            item.itemId === itemId ? { ...item, quantity } : item
          )
        );
      } else {
        toast.error(res.data?.message || "Failed to update quantity.");
      }
    } catch {
      toast.error("Failed to update quantity.");
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete("/Cart/clear");
      if (res.data?.success) {
        setCart([]);
        toast.success("Cart cleared successfully.");
      } else {
        toast.error(res.data?.message || "Failed to clear cart.");
      }
    } catch {
      toast.error("Failed to clear cart.");
    }
  };

  const cartItemCount = useMemo(
    () => cart.reduce((t, i) => t + (i.quantity || 0), 0),
    [cart]
  );

  useEffect(() => {
    if (user) fetchCartItems();
    else setCart([]);
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        refetchCart: fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
