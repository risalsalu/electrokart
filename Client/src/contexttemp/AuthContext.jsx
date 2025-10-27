import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async ({ email, password }) => {
    const res = await authService.login({ email, password });
    const data = res.data;

    const formattedUser = {
      username: data.username,
      email: data.email,
      role: data.role,
    };

    setUser(formattedUser);
    localStorage.setItem("currentUser", JSON.stringify(formattedUser));
    return formattedUser;
  };

  const handleRegister = async ({ username, email, password }) => {
    const res = await authService.register({ username, email, password });
    return res;
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleRegister,
        handleLogout,
        isAdmin: user?.role?.toLowerCase() === "admin",
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
