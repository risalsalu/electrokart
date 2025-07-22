import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Helper function to format user data
  const formatUser = (userData) => ({
    id: userData.id || userData.email,
    name: userData.name || "Unnamed User",
    email: userData.email,
    role: userData.role || "user",
  });

  // Handle login
  const handleLogin = (userData) => {
    const formattedUser = formatUser(userData);
    setUser(formattedUser);
    localStorage.setItem("currentUser", JSON.stringify(formattedUser));
  };

  // Handle logout
  const handleLogout = (onSuccess) => {
    localStorage.removeItem("currentUser");
    setUser(null);
    if (typeof onSuccess === "function") {
      onSuccess(); 
    }
  };

  const handleRegister = (userData) => {
    const formattedUser = formatUser(userData);
    setUser(formattedUser);
    localStorage.setItem("currentUser", JSON.stringify(formattedUser));
  };
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,               
        handleLogin,
        handleLogout,
        handleRegister,
        isAdmin: user?.role === "admin",
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
