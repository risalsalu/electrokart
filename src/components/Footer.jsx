import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: '#ecf0f1',
      padding: '40px 5%',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px'
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '20px' }}>ElectroKart</h3>
          <p style={{ lineHeight: '1.6' }}>
            Your one-stop shop for all electronic needs. Quality products with fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Home</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/products" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Products</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/cart" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Cart</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Customer Service</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Contact Us</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/returns" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Returns Policy</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Contact Us</h4>
          <address style={{ color: '#bdc3c7', fontStyle: 'normal' }}>
            123 Tech Street<br />
            Silicon Valley, CA 94000<br />
            Email: support@electrokart.com<br />
            Phone: (555) 123-4567
          </address>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #34495e',
        color: '#bdc3c7'
      }}>
        &copy; {new Date().getFullYear()} ElectroKart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;