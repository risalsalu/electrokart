import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

function Navbar({ user, onLogout, cartItemCount, wishlistItemCount }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
    }
  }, [debouncedQuery, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 py-3 px-4 md:px-8 flex items-center justify-between font-sans">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          EK
        </div>
        <span className="text-xl font-bold text-gray-800 hidden sm:block">ElectroKart</span>
      </div>

      {/* Search Bar */}
      <div className="flex-grow max-w-xl mx-4 md:mx-8">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Navigation Links and Icons */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Navigation Links */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">Products</Link>
          <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium">Orders</Link>
        </div>

        {/* Wishlist Icon */}
        <div onClick={() => navigate('/wishlist')} className="relative cursor-pointer group" title="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {wishlistItemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {wishlistItemCount}
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <div onClick={() => navigate('/cart')} className="relative cursor-pointer group" title="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartItemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cartItemCount}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        {user ? (
          <div className="relative">
            <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold group-hover:bg-blue-700">
                {user.name.charAt(0)}
              </div>
              <span className="hidden lg:inline text-gray-700 group-hover:text-blue-600">{user.name.split(' ')[0]}</span>
            </div>
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg w-48 overflow-hidden z-50 border border-gray-200">
                <div className="p-4 border-b">
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-gray-500 text-sm truncate">{user.email}</div>
                </div>
                <div onClick={() => navigate('/orders')} className="p-3 hover:bg-gray-50 cursor-pointer text-gray-700 hover:text-blue-600">My Orders</div>
                <div onClick={() => { onLogout(); setShowDropdown(false); }} className="p-3 hover:bg-gray-50 cursor-pointer text-gray-700 hover:text-blue-600">Logout</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 text-sm md:text-base">Login</Link>
            <Link to="/register" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
