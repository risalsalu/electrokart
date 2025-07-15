import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Products = ({ products, addToCart, addToWishlist }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [previewImage, setPreviewImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location.search]);

  useEffect(() => {
    if (categoryFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === categoryFilter)
      );
    }
  }, [categoryFilter, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist`);
  };

  // Modal Close with ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!products || products.length === 0) {
    return <div className="p-4 text-center">No products available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { key: 'all', label: 'All Products' },
          { key: 'mobile', label: 'Smartphones' },
          { key: 'laptop', label: 'Laptops' },
          { key: 'tv', label: 'TVs' },
          { key: 'headphone', label: 'Audio' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCategoryFilter(key)}
            className={`px-4 py-2 rounded-full transition-colors ${
              categoryFilter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative"
            >
              <div
                className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer transform transition-transform duration-300 group-hover:scale-[1.03]"
                onClick={() => setPreviewImage(product.image)}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="text-gray-500">No image</div>
                )}
              </div>

              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 transition"
                  >
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-xl border-4 border-white shadow-2xl animate-fade-in"
          />
        </div>
      )}
    </div>
  );
};

export default Products;
