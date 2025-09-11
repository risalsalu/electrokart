
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home({ products = [] }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideImages = [
    "https://img.freepik.com/free-photo/office-workplace-with-laptop-smartphone_146671-13978.jpg?semt=ais_hybrid&w=740",
    "https://images.unsplash.com/photo-1752867494500-9ea9322f58c9?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595303526913-c7037797ebe7?q=80&w=1229&auto=format&fit=crop"
  ];

  const slideTitles = [
    "Premium Tech at Unbeatable Prices",
    "Summer Sale - Up to 50% Off",
    "New Arrivals Just For You"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideImages.length]);

  const featuredProducts = useMemo(() => {
    return Array.isArray(products) ? products.slice(0, 3) : [];
  }, [products]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const categories = [
    { name: 'Smartphones', icon: '📱', category: 'mobile' },
    { name: 'Laptops', icon: '💻', category: 'laptops' },
    { name: 'TVs', icon: '📺', category: 'tv' },
    { name: 'Audio', icon: '🎧', category: 'headphones' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[500px] overflow-hidden rounded-2xl mb-16 shadow-xl">
        {/* Slideshow */}
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slideImages[currentSlide]})`,
              opacity: 1,
              zIndex: 1
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/10" />
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-start h-full text-left text-white px-8 md:px-16">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-sm px-4 py-2 rounded-full mb-2">
              New Collection 2024
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              {slideTitles[currentSlide]}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Discover the latest electronics at unbeatable prices. Quality products with fast delivery.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find exactly what you need from our carefully curated categories</p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.category)}
              className="cursor-pointer group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                  <span className="text-4xl">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500">Explore Now</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Handpicked selection of our premium products</p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-blue-100"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="h-64 overflow-hidden relative bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="object-contain h-full transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {product.category}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</div>
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-500 text-sm ml-1">(24)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block bg-gray-100 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No featured products found</h3>
            <p className="text-gray-500 mb-4">Check back later for our latest products</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full text-sm transition shadow-md"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-16 shadow-inner">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Trusted by thousands of satisfied customers worldwide</p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Tech Enthusiast',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              comment: "ElectroKart has the best prices and fastest delivery I've ever experienced. My new laptop arrived in perfect condition just 2 days after ordering!",
              rating: 5
            },
            {
              name: 'Michael Chen',
              role: 'Gamer',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              comment: 'The gaming laptop I bought exceeded my expectations. The performance is incredible, and the customer support was very helpful with my setup questions.',
              rating: 5
            },
            {
              name: 'Emma Rodriguez',
              role: 'Designer',
              avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
              comment: 'I was hesitant to buy expensive headphones online, but ElectroKart made the process seamless. The product is authentic and arrived earlier than promised.',
              rating: 4
            }
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
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
              <p className="text-gray-600 mb-6 italic relative before:content-['\201C'] before:text-4xl before:text-gray-300 before:absolute before:-top-2 before:-left-1 before:font-serif before:leading-none">
                {t.comment}
              </p>
              <div className="flex items-center">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white shadow" />
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white mb-16 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Upgrade Your Tech?</h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
          Join thousands of satisfied customers who trust ElectroKart for their electronics needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;