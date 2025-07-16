import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Wishlist({ wishlist, removeFromWishlist, addToCart, user }) {
  //  Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart?.(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleRemove = (e, productId, name) => {
    e.preventDefault();
    removeFromWishlist?.(productId);
    toast.info(`${name} removed from wishlist`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-6">Your wishlist is empty</p>
          <Link
            to="/products"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Product image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="h-full w-full object-contain p-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>

              {/* Product info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-blue-500">
                    ${product.price?.toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{product.rating || "4.0"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="border border-red-500 text-red-500 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors text-sm"
                    onClick={(e) => handleRemove(e, product.id, product.name)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
