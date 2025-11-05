import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("dashboard");
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div
            className={`flex items-center ${
              collapsed ? "justify-center py-5" : "justify-between px-6 py-5 border-b"
            } group`}
          >
            {!collapsed && (
              <h1 className="text-xl font-bold text-indigo-600">ElectroKart Admin</h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-indigo-600 transition-colors group-hover:bg-indigo-50 p-1 rounded-full"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link
              to="/admin/dashboard"
              className={`flex items-center ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } rounded-lg transition-all duration-200 ${
                activeLink === "dashboard"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
              }`}
              onClick={() => handleLinkClick("dashboard")}
            >
              <LayoutDashboard className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </Link>

            <Link
              to="/admin/users"
              className={`flex items-center ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } rounded-lg transition-all duration-200 ${
                activeLink === "users"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
              }`}
              onClick={() => handleLinkClick("users")}
            >
              <Users className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Users</span>}
            </Link>

            <Link
              to="/admin/products"
              className={`flex items-center ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } rounded-lg transition-all duration-200 ${
                activeLink === "products"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
              }`}
              onClick={() => handleLinkClick("products")}
            >
              <Package className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Products</span>}
            </Link>

            <Link
              to="/admin/orders"
              className={`flex items-center ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } rounded-lg transition-all duration-200 ${
                activeLink === "orders"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
              }`}
              onClick={() => handleLinkClick("orders")}
            >
              <ShoppingBag className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Orders</span>}
            </Link>
            <div className={`px-2 py-4 border-t ${collapsed ? "flex justify-center" : ""}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } w-full rounded-lg transition-all duration-200 ${
                collapsed
                  ? "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  : "bg-red-50 text-red-600 font-medium hover:bg-red-100 hover:shadow-sm"
              }`}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
       
          </nav>

           </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-6">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
};

export default AdminLayout;