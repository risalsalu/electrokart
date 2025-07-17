import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ hot-toast

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';

import AuthProvider, { AuthContext } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { OrdersProvider, useOrders } from './context/OrdersContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const [products, setProducts] = useState([]);
  const { user, handleLogin, handleLogout, handleRegister } = useContext(AuthContext);
  const { cart, removeFromCart, updateQuantity, clearCart, addToCart, cartItemCount } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, wishlistItemCount } = useWishlist();
  const { placeOrder } = useOrders();

  useEffect(() => {
    axios.get('http://localhost:3002/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} cartItemCount={cartItemCount} wishlistItemCount={wishlistItemCount} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/search" element={<SearchResults products={products} />} />
          <Route path="/products" element={<Products products={products} addToCart={addToCart} addToWishlist={addToWishlist} />} />
          <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} addToWishlist={addToWishlist} />} />
          <Route path="/cart" element={<ProtectedRoute><Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} addToCart={addToCart} user={user} /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout cart={cart} user={user} clearCart={clearCart} placeOrder={placeOrder} /></ProtectedRoute>} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
        </Routes>

        {/* ✅ react-hot-toast toaster placement */}
        <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrdersProvider>
            <AppContent />
          </OrdersProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </Router>
);

export default App;
