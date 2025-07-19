import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login handler
  const handleLogin = (userData) => {
    const userToStore = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user", // default to user if no role
    };
    setUser(userToStore);
    localStorage.setItem("currentUser", JSON.stringify(userToStore));
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Register handler (optional)
  const handleRegister = (userData) => {
    const userToStore = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
    };
    setUser(userToStore);
    localStorage.setItem("currentUser", JSON.stringify(userToStore));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        handleRegister,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
