import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import { AuthContext } from '../Context/AuthContext';

const Products = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('none');
  const [modalImage, setModalImage] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { cart, addToCart } = useCart();
  const { isLoggedIn } = useContext(AuthContext);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    if (category) setCategoryFilter(category.toLowerCase());
  }, [location.search]);

  useEffect(() => {
    let updatedProducts = [...products];

    if (categoryFilter !== 'all') {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (sortOrder === 'high') {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'low') {
      updatedProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(updatedProducts);
  }, [categoryFilter, products, sortOrder]);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add products to your cart.');
      return;
    }

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      toast.error(`${product.name} is already in cart.`);
    } else {
      addToCart(product); 
    }
  };

  const handleWishlistToggle = (product) => {
    if (!isLoggedIn) {
      toast.error('Please log in to use the wishlist.');
      return;
    }

    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setModalImage(null);
        setModalProduct(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'all', label: 'All Products' },
            { key: 'mobile', label: 'Smartphones' },
            { key: 'laptops', label: 'Laptops' },
            { key: 'tv', label: 'TVs' },
            { key: 'headphones', label: 'Audio' },
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

        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm"
          >
            <option value="none">Sort by</option>
            <option value="high">High to Low</option>
            <option value="low">Low to High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative"
            >
              <div
                className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer transform transition-transform duration-300 group-hover:scale-[1.03]"
                onClick={() => {
                  setModalImage(product.image || 'https://via.placeholder.com/600');
                  setModalProduct(product);
                }}
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
                 <p className="text-gray-600 mb-2">${Number(product.price).toFixed(2)}</p>

                <div className="mt-4 flex space-x-2 items-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Add to Cart
                  </button>

                  <button onClick={() => handleWishlistToggle(product)}>
                    <Heart
                      size={24}
                      className={`transition-colors duration-300 ${
                        wishlist.some((item) => item.id === product.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-500'
                      }`}
                    />
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

      {modalImage && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-50 flex items-center justify-center"
          onClick={() => {
            setModalImage(null);
            setModalProduct(null);
          }}
        >
          <div
            className="bg-white p-4 rounded-xl shadow-2xl border-4 border-black max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt={modalProduct?.name || 'Preview'}
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
