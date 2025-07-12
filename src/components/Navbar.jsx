import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout, cartItemCount, wishlistItemCount }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Style objects for consistent styling
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      padding: '0 5%',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    },
    logo: {
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      cursor: 'pointer'
    },
    logoBox: {
      width: '36px',
      height: '36px',
      backgroundColor: '#3498db',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50'
    },
    navLink: {
      textDecoration: 'none',
      color: '#2c3e50',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'color 0.2s'
    },
    iconContainer: {
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#e74c3c',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    userIcon: {
      width: '36px',
      height: '36px',
      backgroundColor: '#3498db',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold'
    },
    dropdown: {
      position: 'absolute',
      top: '50px',
      right: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
      width: '200px',
      zIndex: 100,
      overflow: 'hidden'
    },
    dropdownItem: {
      padding: '12px 20px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ':hover': { backgroundColor: '#f8f9fa' }
    }
  };

  return (
    <div style={styles.container}>
      {/* Logo */}
      <div style={styles.logo} onClick={() => navigate('/')}>
        <div style={styles.logoBox}>EK</div>
        <span style={styles.logoText}>ElectroKart</span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '30px' }}>
        <Link 
          to="/" 
          style={styles.navLink}
          onMouseOver={(e) => e.target.style.color = '#3498db'}
          onMouseOut={(e) => e.target.style.color = '#2c3e50'}
        >
          Home
        </Link>
        <Link 
          to="/products" 
          style={styles.navLink}
          onMouseOver={(e) => e.target.style.color = '#3498db'}
          onMouseOut={(e) => e.target.style.color = '#2c3e50'}
        >
          Products
        </Link>
        <Link 
          to="/orders" 
          style={styles.navLink}
          onMouseOver={(e) => e.target.style.color = '#3498db'}
          onMouseOut={(e) => e.target.style.color = '#2c3e50'}
        >
          Orders
        </Link>
      </div>

      {/* Right Side Icons */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        {/* Wishlist */}
        <div style={styles.iconContainer} onClick={() => navigate('/wishlist')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {wishlistItemCount > 0 && <div style={styles.badge}>{wishlistItemCount}</div>}
        </div>
        
        {/* Cart */}
        <div style={styles.iconContainer} onClick={() => navigate('/cart')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartItemCount > 0 && <div style={styles.badge}>{cartItemCount}</div>}
        </div>
        
        {/* User Account */}
        {user ? (
          <div 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div style={styles.userIcon}>
              {user.name.charAt(0)}
            </div>
            
            {showDropdown && (
              <div style={styles.dropdown}>
                <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontWeight: '600', color: '#2c3e50' }}>{user.name}</div>
                  <div style={{ fontSize: '13px', color: '#7f8c8d' }}>{user.email}</div>
                </div>
                <div 
                  style={styles.dropdownItem}
                  onClick={() => navigate('/orders')}
                >
                  My Orders
                </div>
                <div 
                  style={styles.dropdownItem}
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link 
              to="/login" 
              style={{
                ...styles.navLink,
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;