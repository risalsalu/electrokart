import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineHeart, AiFillStar } from 'react-icons/ai';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3002/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Failed to load product:", err));
  }, [id]);

  if (!product) return <div className="text-center mt-16 text-lg">Loading product details...</div>;

  return (
    <>
      {/*  Image Modal */}
{isModalOpen && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-50 flex items-center justify-center"
    onClick={() => setIsModalOpen(false)}
  >
    <div
      className="bg-white p-4 rounded-xl shadow-2xl border-4 border-black max-w-[90%] max-h-[90%]"
      onClick={(e) => e.stopPropagation()} // prevents closing on image click
    >
      <img
        src={product.image || 'https://via.placeholder.com/600'}
        alt={product.name}
        className="max-h-[70vh] max-w-full object-contain"
      />
    </div>
  </div>
)}



      {/*  Product Detail Layout */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/*  Image Section */}
        <div
          className="rounded-xl overflow-hidden shadow-xl border hover:shadow-2xl transition-transform duration-300 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-[400px] object-contain bg-white"
          />
        </div>

        {/*  Info Section */}
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
            {product.description || 'No detailed description available.'}
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className="flex items-center gap-2 border border-gray-400 hover:bg-gray-100 px-6 py-3 rounded-lg text-gray-700 transition"
            >
              <AiOutlineHeart className="text-red-500 text-xl" />
              Add to Wishlist
            </button>
          </div>

          <div className="mt-8 border-t pt-6 text-sm text-gray-500">
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
