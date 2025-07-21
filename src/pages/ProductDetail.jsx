import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart, AiFillStar } from "react-icons/ai";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const { cart, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isInCart = cart?.some((item) => item.id === parseInt(id));

  useEffect(() => {
    axios
      .get(`http://localhost:3002/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Failed to load product:", err);
        toast.error("Failed to load product.");
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart.");
      return;
    }
    if (isInCart) {
      toast.error("Product already in cart.");
      return;
    }
    addToCart(product);
  };

  const toggleWishlist = () => {
    if (!user) {
      toast.error("Please login to use wishlist.");
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist.");
    }
  };

  if (!product)
    return (
      <div className="text-center mt-16 text-lg">Loading product details...</div>
    );

  return (
    <>
      {/* Modal for Image Preview */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-xl shadow-2xl border-4 border-black max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.image || "https://via.placeholder.com/600"}
              alt={product.name}
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Main Product View */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/* Product Image */}
        <div
          className="relative rounded-xl overflow-hidden shadow-xl border hover:shadow-2xl transition-transform duration-300 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {/* Heart Wishlist Icon */}
          <div
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
          >
            {isInWishlist(product.id) ? (
              <AiFillHeart className="text-red-500 text-2xl" />
            ) : (
              <AiOutlineHeart className="text-red-500 text-2xl" />
            )}
          </div>

          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-[400px] object-contain bg-white"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-2xl font-semibold text-green-600">${product.price}</p>

          <div className="flex items-center gap-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <AiFillStar key={i} className="text-xl" />
            ))}
            <span className="text-gray-500 text-sm">(4.5 / 5)</span>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description || "No detailed description available."}
          </p>

          <div className="mt-6">
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`${
                isInCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-3 rounded-lg font-medium transition`}
            >
              {isInCart ? "Already in Cart" : "Add to Cart"}
            </button>
          </div>

          <div className="mt-8 border-t pt-6 text-sm text-gray-500 space-y-1">
            <p>🚚 Free Delivery within 3-5 business days</p>
            <p>🔄 Easy Returns within 7 days</p>
            <p>💳 Secure Payment options</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
