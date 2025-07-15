import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Home({ products = [], addToCart = () => {} }) {
  const navigate = useNavigate();

  const featuredProducts = useMemo(() => {
    return Array.isArray(products) ? products.slice(0, 3) : [];
  }, [products]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  const handleAddToCart = (product) => {
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
      {/* Hero Section */}
      <div 
        className="relative rounded-2xl overflow-hidden mb-12 md:mb-16 h-[50vh] min-h-[400px] flex items-center"
        style={{
          backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1726863026105-b320133454e7?q=80&w=1132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/40"></div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome to ElectroKart
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover the latest electronics at unbeatable prices. Quality products with fast delivery to your doorstep.
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/30"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-56 overflow-hidden relative">
                  <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                    <img 
                      src={product.image || "/images/placeholder.jpg"} 
                      alt={product.name} 
                      className="object-contain h-full" 
                      onError={(e) => e.target.src = "/images/placeholder.jpg"}
                    />
                  </div>
                  {product.stock && product.stock < 10 && (
                    <div className="absolute top-4 right-4 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                      Only {product.stock} left
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-yellow-800 text-sm font-medium ml-1">
                        {product.rating || "4.5"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                      onClick={() => handleAddToCart(product)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl py-16 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2zm12 0H6v10h12V7zM9 5h6v2H9V5z" />
            </svg>
            <p className="text-gray-600 text-lg mt-4">No featured products available</p>
          </div>
        )}
      </div>

      {/* Category Cards */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Shop By Category
          </h2>
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

      {/* Testimonials Section here (unchanged) */}
                 <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl p-8 md:p-12 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Sarah Johnson', 
              role: 'Tech Enthusiast', 
              comment: 'ElectroKart has the best prices and fastest delivery I\'ve ever experienced. My new laptop arrived in perfect condition just 2 days after ordering!',
              rating: 5
            },
            { 
              name: 'Michael Chen', 
              role: 'Gamer', 
              comment: 'The gaming laptop I bought exceeded my expectations. The performance is incredible, and the customer support was very helpful with my setup questions.',
              rating: 5
            },
            { 
              name: 'Emma Rodriguez', 
              role: 'Designer', 
              comment: 'I was hesitant to buy expensive headphones online, but ElectroKart made the process seamless. The product is authentic and arrived earlier than promised.',
              rating: 4
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
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
