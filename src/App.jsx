import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { OrdersProvider, useOrders } from './context/OrdersContext';

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );

  useEffect(() => {
    axios.get('http://localhost:3002/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleLogin = (userData) => {
    const userObj = { email: userData.email, name: userData.name };
    setUser(userObj);
    localStorage.setItem('currentUser', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleRegister = handleLogin;

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToCart,
    cartItemCount,
  } = useCart();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    wishlistItemCount,
  } = useWishlist();

  const { placeOrder } = useOrders();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlistItemCount}
      />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<Home products={products} addToCart={addToCart} />}
          />
          <Route
            path="/search"
            element={<SearchResults products={products} />}
          />
          <Route
            path="/products"
            element={
              <Products
                products={products}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetail
                addToCart={addToCart}
                addToWishlist={addToWishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  user={user}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute user={user}>
                <Wishlist
                  wishlist={wishlist}
                  removeFromWishlist={removeFromWishlist}
                  addToCart={addToCart}
                  user={user}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute user={user}>
                <Checkout
                  cart={cart}
                  user={user}
                  clearCart={clearCart}
                  placeOrder={placeOrder}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={1000} />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <OrdersProvider>
            <AppContent />
          </OrdersProvider>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}
