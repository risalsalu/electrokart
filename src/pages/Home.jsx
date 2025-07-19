import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Home({ products = [], addToCart = () => {}, cart = [] }) {
  const navigate = useNavigate();

  const featuredProducts = useMemo(() => {
    return Array.isArray(products) ? products.slice(0, 3) : [];
  }, [products]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  const handleAddToCart = (product) => {
    const exists = cart.some(item => item.id === product.id);
    if (exists) {
      toast.info(`${product.name} is already in your cart`);
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const categories = [
    { name: 'Smartphones', icon: '📱', category: 'mobile' },
    { name: 'Laptops', icon: '💻', category: 'laptop' },
    { name: 'TVs', icon: '📺', category: 'tv' },
    { name: 'Audio', icon: '🎧', category: 'headphone' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Moving Background */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden rounded-2xl mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center animate-[moveBG_40s_linear_infinite]"
          style={{
            backgroundImage:
              'url("https://plus.unsplash.com/premium_photo-1726863026105-b320133454e7?q=80&w=1132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ElectroKart</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6">
            Discover the latest electronics at unbeatable prices. Quality products with fast delivery.
          </p>
          <Link
            to="/products"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Shop Now
          </Link>
        </div>
        <style>{`
          @keyframes moveBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>

      {/* Categories Section at Top */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Shop By Category</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.category)}
              className="cursor-pointer bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center group"
            >
              <div className="text-4xl mb-3 group-hover:text-blue-600 transition-colors">{cat.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4"></div>
          <Link
            to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full text-sm transition"
          >
            View All Products
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-shadow"
              >
                <div className="h-56 overflow-hidden relative bg-gray-50 flex items-center justify-center">
                  <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="object-contain h-full"
                    onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                  />
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-sm rounded-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No featured products found.</div>
        )}
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl p-8 md:p-12 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">What Our Customers Say</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Tech Enthusiast',
              comment:
                "ElectroKart has the best prices and fastest delivery I've ever experienced. My new laptop arrived in perfect condition just 2 days after ordering!",
              rating: 5
            },
            {
              name: 'Michael Chen',
              role: 'Gamer',
              comment:
                'The gaming laptop I bought exceeded my expectations. The performance is incredible, and the customer support was very helpful with my setup questions.',
              rating: 5
            },
            {
              name: 'Emma Rodriguez',
              role: 'Designer',
              comment:
                'I was hesitant to buy expensive headphones online, but ElectroKart made the process seamless. The product is authentic and arrived earlier than promised.',
              rating: 4
            }
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow">
              <div className="flex mb-4">
                {[...Array(5)].map((_, idx) => (
                  <svg
                    key={idx}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${idx < t.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{t.comment}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
