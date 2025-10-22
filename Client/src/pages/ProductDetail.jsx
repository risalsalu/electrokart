import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart, AiFillStar } from "react-icons/ai";
import { AuthContext } from "../contexttemp/AuthContext";
import { useCart } from "../contexttemp/CartContext";
import { useWishlist } from "../contexttemp/WishlistContext";
import { getProductById } from "../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoggedIn } = useContext(AuthContext);
  const { cart, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isInCart = cart?.some((item) => item.id === parseInt(id));

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0] || data.imageUrl || data.image);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load product details.");
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) return toast.error("Please login to add items to cart.");
    if (isInCart) return toast.error("Product already in cart.");
    addToCart(product);
    toast.success("Product added to cart!");
  };

  const toggleWishlist = () => {
    if (!isLoggedIn) return toast.error("Please login to use wishlist.");
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist.");
    }
  };

  if (!product) return <p className="text-center mt-16">Loading product...</p>;

  return (
    <>
      {/* Image Modal */}
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
              src={mainImage}
              alt={product.name}
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Product Details */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <div className="space-y-4">
          <div
            className="relative rounded-xl overflow-hidden shadow-xl border hover:shadow-2xl transition-transform duration-300 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
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
              src={mainImage}
              alt={product.name}
              className="w-full h-[400px] object-contain bg-white"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImage === img ? "border-blue-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-2xl font-semibold text-green-600">
            ₹{product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <AiFillStar key={i} className="text-xl" />
            ))}
            <span className="text-gray-500 text-sm">(4.5 / 5)</span>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description || "No detailed description available."}
          </p>

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
