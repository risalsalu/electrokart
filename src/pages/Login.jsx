import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Login({onLogin}) {
const location = useLocation();
const [email, setEmail] = useState(location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();
  
  // Get all registered users
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Find user with matching email and password
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Save current user session
    localStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      name: user.name
    }));
    
    // Call the onLogin function from props
    onLogin({
      email: user.email,
      name: user.name
    });
    
    alert('Login successful!');
    navigate('/');
  } else {
    alert('Invalid email or password.');
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Welcome to ElectroKart</h2>
          <p className="text-blue-100 mt-1">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </form>
        
        <div className="border-t border-gray-200 px-6 py-5 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;