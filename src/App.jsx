// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import Home from './pages/Home';
// // import Login from './pages/Login';
// // import Register from './pages/Register';
// // import Products from './pages/Products';

// // function App() {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<Home />} />
// //       <Route path="/products" element={<Products />} />
// //       <Route path="/login" element={<Login />} />
// //       <Route path="/register" element={<Register />} />
// //       <Route path="*" element={<Navigate to="/" />} />
// //     </Routes>
// //   );
// // }

// // export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Wishlist from './pages/Wishlist';
// import Orders from './pages/Orders';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Checkout from './pages/Checkout';
// import Footer from "./components/Footer.jsx"; 

// function App() {
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
  
//   const [wishlist, setWishlist] = useState(() => {
//     const savedWishlist = localStorage.getItem('wishlist');
//     return savedWishlist ? JSON.parse(savedWishlist) : [];
//   });
  
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });
  
//   const [orders, setOrders] = useState(() => {
//     const savedOrders = localStorage.getItem('orders');
//     return savedOrders ? JSON.parse(savedOrders) : [];
//   });
  
//   const [products] = useState([
//     // Your product data here (same as before)
//   ]);

//   // Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   // Save wishlist to localStorage
//   useEffect(() => {
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//   }, [wishlist]);

//   // Save orders to localStorage
//   useEffect(() => {
//     localStorage.setItem('orders', JSON.stringify(orders));
//   }, [orders]);

//   // Add to cart function
//   const addToCart = (product, quantity = 1) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
      
//       if (existingItem) {
//         return prevCart.map(item => 
//           item.id === product.id 
//             ? {...item, quantity: item.quantity + quantity} 
//             : item
//         );
//       } else {
//         return [...prevCart, {...product, quantity}];
//       }
//     });
//   };

//   // Remove from cart
//   const removeFromCart = (productId) => {
//     setCart(prevCart => prevCart.filter(item => item.id !== productId));
//   };

//   // Update cart quantity
//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity < 1) return;
    
//     setCart(prevCart => 
//       prevCart.map(item => 
//         item.id === productId 
//           ? {...item, quantity: newQuantity} 
//           : item
//       )
//     );
//   };

//   // Add to wishlist
//   const addToWishlist = (product) => {
//     setWishlist(prev => 
//       prev.some(item => item.id === product.id) 
//         ? prev 
//         : [...prev, product]
//     );
//   };

//   // Remove from wishlist
//   const removeFromWishlist = (productId) => {
//     setWishlist(prev => prev.filter(item => item.id !== productId));
//   };

//   // Login function
//   const handleLogin = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   // Logout function
//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   // Register function
//   const handleRegister = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   // Place order
//   const placeOrder = (orderDetails) => {
//     const newOrder = {
//       id: Date.now(),
//       date: new Date().toISOString(),
//       items: orderDetails.items,
//       total: orderDetails.total,
//       status: 'Processing',
//       shippingAddress: orderDetails.shippingAddress
//     };
    
//     setOrders(prev => [...prev, newOrder]);
//     setCart([]); // Clear cart after order
//   };

//   return (
//     <Router>
//       <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//         <Navbar 
//           user={user} 
//           onLogout={handleLogout} 
//           cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)} 
//           wishlistItemCount={wishlist.length}
//         />
        
//         <div style={{ flex: 1, padding: '20px 0' }}>
//           <Routes>
//             <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
//             <Route path="/products" element={<Products products={products} addToCart={addToCart} addToWishlist={addToWishlist} />} />
//             <Route 
//               path="/products/:id" 
//               element={<ProductDetail products={products} addToCart={addToCart} addToWishlist={addToWishlist} />} 
//             />
//             <Route 
//               path="/cart" 
//               element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} 
//             />
//             <Route 
//               path="/wishlist" 
//               element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} addToCart={addToCart} />} 
//             />
//             <Route 
//               path="/orders" 
//               element={user ? <Orders orders={orders} /> : <Navigate to="/login" />} 
//             />
//             <Route 
//               path="/login" 
//               element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
//             />
//             <Route 
//               path="/register" 
//               element={user ? <Navigate to="/" /> : <Register onRegister={handleRegister} />} 
//             />
//             <Route 
//               path="/checkout" 
//               element={user ? <Checkout cart={cart} placeOrder={placeOrder} /> : <Navigate to="/login" />} 
//             />
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </div>
        
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Wishlist from './pages/Wishlist';
// import Orders from './pages/Orders';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Checkout from './pages/Checkout';
// import Footer from './components/Footer';

// function App() {
//   return (
//     <Router>
//       <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//         <Navbar />
//         <div style={{ flex: 1 }}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/products/:id" element={<ProductDetail />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/wishlist" element={<Wishlist />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/checkout" element={<Checkout />} />
//           </Routes>
//         </div>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  const [products] = useState([
    {
      id: 1,
      name: "Smartphone X Pro",
      price: 899.99,
      description: "6.7-inch OLED display, 128GB storage, triple camera system",
      category: "Electronics",
      rating: 4.7,
      stock: 15
    },
    {
      id: 2,
      name: "Ultra HD Smart TV",
      price: 1299.99,
      description: "65-inch 4K display with HDR, smart features, and voice control",
      category: "Electronics",
      rating: 4.5,
      stock: 8
    },
    {
      id: 3,
      name: "Wireless Noise-Cancelling Headphones",
      price: 349.99,
      description: "30-hour battery life, premium sound quality, comfortable design",
      category: "Electronics",
      rating: 4.8,
      stock: 22
    },
    {
      id: 4,
      name: "Gaming Laptop Pro",
      price: 1599.99,
      description: "RTX 3070, 16GB RAM, 1TB SSD, 144Hz display",
      category: "Computers",
      rating: 4.6,
      stock: 5
    }
  ]);

  const [cart, setCart] = useState([]);

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

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
            <Route path="/products" element={<Products products={products} addToCart={addToCart} />} />
            <Route path="/products/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;