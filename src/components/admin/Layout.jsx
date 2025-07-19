// src/admin/components/admin/layout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/dashboard" className="hover:bg-gray-700 px-4 py-2 rounded">
            Dashboard
          </Link>
          <Link to="/admin/users" className="hover:bg-gray-700 px-4 py-2 rounded">
            User Management
          </Link>
          <Link to="/admin/products" className="hover:bg-gray-700 px-4 py-2 rounded">
            Product Management
          </Link>
          <Link to="/admin/orders" className="hover:bg-gray-700 px-4 py-2 rounded">
            Order Management
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
