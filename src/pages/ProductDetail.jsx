import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    fetch(`http://localhost:3002/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      {/* 🔍 Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={product.image || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="max-w-[90%] max-h-[80%] rounded-lg shadow-2xl border-4 border-white"
          />
        </div>
      )}

      {/* 🛍 Product Detail */}
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
        {/* Product Image with hover zoom & click-to-enlarge */}
        <div
          className="overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-auto object-contain transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-xl font-semibold text-green-600 mb-2">${product.price}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <AiFillStar key={i} className="text-yellow-400 text-xl" />
            ))}
            <span className="ml-2 text-gray-500">(4.5/5 Rating)</span>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>

            <button
              onClick={() => addToWishlist(product)}
              className="flex items-center gap-1 border border-gray-400 px-6 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <AiOutlineHeart className="text-red-500" />
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
