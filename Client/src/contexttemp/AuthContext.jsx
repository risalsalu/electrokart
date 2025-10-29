// src/contexttemp/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        return;
      }
      const refreshed = await authService.refresh();
      if (refreshed?.data?.accessToken) {
        const newUser = {
          username: refreshed.data.username,
          email: refreshed.data.email,
          role: refreshed.data.role,
        };
        setUser(newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("currentUser");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogin = async ({ email, password }) => {
    const res = await authService.login({ email, password });
    const data = res?.data;
    if (!data) return null;

    const userData = {
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    return userData;
  };

  const handleRegister = async ({ username, email, password }) => {
    return await authService.register({ username, email, password });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("currentUser");
    document.cookie = "AccessToken=; Max-Age=0; path=/; secure; SameSite=None";
    document.cookie = "RefreshToken=; Max-Age=0; path=/; secure; SameSite=None";
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
