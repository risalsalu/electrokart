import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
