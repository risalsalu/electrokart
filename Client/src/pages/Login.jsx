import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexttemp/AuthContext";
import api from "../services/api"; // your axios instance

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Optional: pre-fill email if coming from registration
  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
    }
  }, [location.state]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/Auth/Login", { email, password });
      const data = response.data;

      if (data.success && data.data) {
        // Update AuthContext
        const user = {
          username: data.data.username,
          email: data.data.email,
          role: data.data.role,
          token: data.data.accessToken,
        };

        await handleLogin({ email, password }); // this will update context + localStorage

        toast.success("Login successful!");

        // Clear form fields
        setEmail("");
        setPassword("");

        // Redirect based on role
        if (user.role === "Admin") navigate("/admin/dashboard");
        else navigate("/");
      } else {
        const msg = data.message || "Invalid credentials";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Welcome to ElectroKart</h2>
          <p className="text-blue-100 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

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
              <span
                className="text-sm text-blue-600 hover:underline cursor-pointer"
                onClick={() =>
                  toast("Forgot password feature not implemented yet.")
                }
              >
                Forgot password?
              </span>
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
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
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
