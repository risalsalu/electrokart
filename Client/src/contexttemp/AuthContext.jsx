// src/contexttemp/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  // Map backend response to frontend user object
  const formatUser = (res) => {
    const data = res.data || {};
    return {
      id: data.email, // or data.id if backend has it
      username: data.username || "Unnamed User",
      email: data.email,
      role: data.role ? data.role.toLowerCase() : "user",
      token: data.accessToken || null,
    };
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await authService.login({ email, password });

      if (!res || !res.data) {
        throw new Error(res?.message || "Login failed");
      }

      const formatted = formatUser(res);
      setUser(formatted);
      localStorage.setItem("currentUser", JSON.stringify(formatted));
      return formatted;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      const res = await authService.register({ username, email, password });

      if (!res || !res.data) {
        throw new Error(res?.message || "Registration failed");
      }

      const formatted = formatUser(res);
      setUser(formatted);
      localStorage.setItem("currentUser", JSON.stringify(formatted));
      return formatted;
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("currentUser");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleRegister,
        handleLogout,
        isAdmin: user?.role === "admin",
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
