import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, ChevronDown, ChevronUp, Mail, Phone, User, ShoppingCart, Heart, Package, Shield, Sliders } from "lucide-react";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/users");
      setUsers(
        await Promise.all(
          res.data.map(async (u) => {
            const [orders, cart, wishlist] = await Promise.all([
              axios.get(`http://localhost:3002/orders?userId=${u.id}`),
              axios.get(`http://localhost:3002/cart?userId=${u.id}`),
              axios.get(`http://localhost:3002/wishlist?userId=${u.id}`),
            ]);
            const totalSpend = orders.data.reduce(
              (sum, o) => sum + (parseFloat(o.total) || 0),
              0
            );
            return {
              ...u,
              status: u.status || "active",
              orders: orders.data,
              cart: cart.data,
              wishlist: wishlist.data,
              totalSpend,
              orderCount: orders.data.length,
              cartCount: cart.data.length,
              wishlistCount: wishlist.data.length,
            };
          })
        )
      );
    } catch (err) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    try {
      await axios.patch(`http://localhost:3002/users/${user.id}`, {
        status: newStatus,
      });
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user status.");
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const filtered = sortedUsers.filter((u) => {
    const term = searchTerm.toLowerCase();
    const match =
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone || "").includes(term);
    const roleOk = !roleFilter || u.role === roleFilter;
    const statusOk = !statusFilter || u.status === statusFilter;
    return match && roleOk && statusOk;
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          
          <button 
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("");
              setStatusFilter("");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            Loading users...
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 border-b">
              <div className="col-span-1"></div>
              <div 
                className="col-span-3 flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => requestSort('name')}
              >
                User {getSortIndicator('name')}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => requestSort('email')}
              >
                Email {getSortIndicator('email')}
              </div>
              <div 
                className="col-span-1 flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => requestSort('role')}
              >
                Role {getSortIndicator('role')}
              </div>
              <div 
                className="col-span-1 flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => requestSort('status')}
              >
                Status {getSortIndicator('status')}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => requestSort('totalSpend')}
              >
                Total Spend {getSortIndicator('totalSpend')}
              </div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No users found matching your criteria.
              </div>
            ) : (
              filtered.map((u) => {
                const isOpen = expanded[u.id];
                return (
                  <React.Fragment key={u.id}>
                    {/* User Row */}
                    <div className="grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50">
                      <div className="col-span-1">
                        <button
                          onClick={() => setExpanded((s) => ({ ...s, [u.id]: !isOpen }))}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          {u.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone size={14} className="mr-1" /> {u.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center text-sm">
                        <Mail size={16} className="mr-2 text-gray-400" />
                        {u.email}
                      </div>
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status === 'blocked' ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="font-medium">${u.totalSpend.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          {u.orderCount} order{u.orderCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end space-x-2">
                        <button
                          onClick={() => toggleStatus(u)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            u.status === "active"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {u.status === "active" ? "Block" : "Unblock"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isOpen && (
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* User Details */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                              <User size={18} className="mr-2" /> User Details
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-500">Joined:</span>{' '}
                                {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="text-gray-500">Last Active:</span>{' '}
                                {new Date(u.lastActive || Date.now()).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="text-gray-500">Email Verified:</span>{' '}
                                {u.emailVerified ? 'Yes' : 'No'}
                              </div>
                            </div>
                          </div>

                          {/* Activity Summary */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Sliders size={18} className="mr-2" /> Activity Summary
                            </h3>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-2">
                                <div className="bg-blue-50 text-blue-600 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-1">
                                  <Package size={20} />
                                </div>
                                <div className="font-medium">{u.orderCount}</div>
                                <div className="text-xs text-gray-500">Orders</div>
                              </div>
                              <div className="p-2">
                                <div className="bg-yellow-50 text-yellow-600 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-1">
                                  <ShoppingCart size={20} />
                                </div>
                                <div className="font-medium">{u.cartCount}</div>
                                <div className="text-xs text-gray-500">Cart Items</div>
                              </div>
                              <div className="p-2">
                                <div className="bg-pink-50 text-pink-600 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-1">
                                  <Heart size={20} />
                                </div>
                                <div className="font-medium">{u.wishlistCount}</div>
                                <div className="text-xs text-gray-500">Wishlist</div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Orders */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Package size={18} className="mr-2" /> Recent Orders
                            </h3>
                            {u.orders.length > 0 ? (
                              <div className="space-y-2 text-sm">
                                {u.orders.slice(0, 3).map((o) => (
                                  <div key={o.id} className="border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex justify-between">
                                      <span className="font-medium">Order #{o.id}</span>
                                      <span className="text-blue-600">${o.total}</span>
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {new Date(o.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                ))}
                                {u.orders.length > 3 && (
                                  <div className="text-blue-600 text-xs mt-2">
                                    + {u.orders.length - 3} more orders
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">No orders yet</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;