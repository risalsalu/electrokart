import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';

function App() {
  // Sample product data
  const [products] = useState([
    {
      id: 1,
      name: "Smartphone X Pro",
      price: 899.99,
      description: "6.7-inch OLED display, 128GB storage, triple camera system",
      category: "Electronics",
      rating: 4.7,
      stock: 15,
      image: "/images/smartphone.jpg"
    },
    {
      id: 2,
      name: "Ultra HD Smart TV",
      price: 1299.99,
      description: "65-inch 4K display with HDR, smart features, and voice control",
      category: "Electronics",
      rating: 4.5,
      stock: 8,
      image: "/images/tv.jpg"
    },
    {
      id: 3,
      name: "Wireless Noise-Cancelling Headphones",
      price: 349.99,
      description: "30-hour battery life, premium sound quality, comfortable design",
      category: "Electronics",
      rating: 4.8,
      stock: 22,
      image: "/images/headphones.jpg"
    },
    {
      id: 4,
      name: "Gaming Laptop Pro",
      price: 1599.99,
      description: "RTX 3070, 16GB RAM, 1TB SSD, 144Hz display",
      category: "Computers",
      rating: 4.6,
      stock: 5,
      image: "/images/laptop.jpg"
    }
  ]);

  // State initialization with localStorage
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem('wishlist')) || []
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // Persist cart and wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? {...item, quantity: item.quantity + quantity} 
            : item
        );
      } else {
        return [...prevCart, {...product, quantity}];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? {...item, quantity: newQuantity} 
          : item
      )
    );
  };

  // Wishlist functions
  const addToWishlist = (product) => {
    setWishlist(prev => 
      prev.some(item => item.id === product.id) 
        ? prev 
        : [...prev, product]
    );
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  // Auth functions
  const handleLogin = (userData) => {
    const userToStore = {
      email: userData.email,
      name: userData.name,
    };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  };

  const handleRegister = (userData) => {
    const userToStore = {
      email: userData.email,
      name: userData.name,
    };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
  };

  // Helper calculations
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

  // Protected Route component
  const ProtectedRoute = ({ user, children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar 
          user={user}
          onLogout={handleLogout}
          cartItemCount={cartItemCount}
          wishlistItemCount={wishlistItemCount}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
            <Route path="/products" element={
              <Products 
                products={products} 
                addToCart={addToCart} 
                addToWishlist={addToWishlist}
              />
            } />
            <Route path="/products/:id" element={
              <ProductDetail 
                products={products} 
                addToCart={addToCart} 
                addToWishlist={addToWishlist}
              />
            } />
            <Route path="/cart" element={
              <Cart 
                cart={cart} 
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            } />
            <Route path="/wishlist" element={
              <Wishlist 
                wishlist={wishlist} 
                removeFromWishlist={removeFromWishlist}
                addToCart={addToCart}
              />
            } />
            <Route path="/orders" element={
              <ProtectedRoute user={user}>
                <Orders user={user} />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/checkout" element={
              <ProtectedRoute user={user}>
                <Checkout 
                  cart={cart} 
                  user={user} 
                  clearCart={() => setCart([])}
                />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;