import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );

  const handleLogin = (userData) => {
    const userToStore = {
      email: userData.email,
      name: userData.name,
    };
    setUser(userToStore);
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleRegister = (userData) => {
    const userToStore = {
      email: userData.email,
      name: userData.name,
    };
    setUser(userToStore);
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout, handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
