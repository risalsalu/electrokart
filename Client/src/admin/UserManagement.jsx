import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import userService from "../services/userService";
import api from "../services/api";
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  User,
  ShoppingCart,
  Heart,
  Package,
  Sliders,
  Loader2,
  DollarSign,
  Trash2,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRes = await userService.getAllUsers();
      const ordersRes = await api.get("/Orders/all-orders");

      const usersWithStats = usersRes.data.map((user) => {
        const userOrders = ordersRes.data.filter(
          (o) => o.userId === user.id || o.applicationUserId === user.id
        );
        const totalSpend = userOrders.reduce(
          (sum, o) => sum + (parseFloat(o.totalAmount || o.total || 0)),
          0
        );
        return {
          ...user,
          status: user.isBlocked ? "blocked" : "active",
          orders: userOrders,
          orderCount: userOrders.length,
          totalSpend,
        };
      });
      setUsers(usersWithStats);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      await userService.toggleUserBlock(user.id);
      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update user status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
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
      (u.name || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.phone || "").includes(term);
    
    const roleOk = !roleFilter || (u.role && u.role.toLowerCase() === roleFilter);
    const statusOk = !statusFilter || u.status === statusFilter;
    
    return match && roleOk && statusOk;
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" /> User Management
      </h2>
      
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-3" />
            Loading users...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 border-b hidden md:grid">
              <div className="col-span-1"></div>
              <div 
                className="col-span-3 flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => requestSort('name')}
              >
                User {getSortIndicator('name')}
              </div>
              <div 
                className="col-span-3 flex items-center cursor-pointer hover:text-blue-600"
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
                className="col-span-1 flex items-center cursor-pointer hover:text-blue-600"
                onClick={() => requestSort('totalSpend')}
              >
                Spend {getSortIndicator('totalSpend')}
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
                const userRole = (u.role || "user").toLowerCase();
                return (
                  <React.Fragment key={u.id}>
                    <div className="grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50">
                      <div className="col-span-1">
                        <button
                          onClick={() => setExpanded((s) => ({ ...s, [u.id]: !isOpen }))}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                      <div className="col-span-11 md:col-span-3 flex items-center">
                        <div className={`bg-blue-100 text-blue-600 rounded-full p-2 mr-3`}>
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-medium">{u.name || "N/A"}</div>
                          {u.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone size={14} className="mr-1" /> {u.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-12 mt-2 md:mt-0 md:col-span-3 flex items-center text-sm">
                        <Mail size={16} className="mr-2 text-gray-400 hidden md:block" />
                        {u.email}
                      </div>
                      <div className="col-span-4 mt-2 md:mt-0 md:col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userRole === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userRole}
                        </span>
                      </div>
                      <div className="col-span-4 mt-2 md:mt-0 md:col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status === 'blocked' ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      <div className="col-span-4 mt-2 md:mt-0 md:col-span-1">
                        <div className="font-medium">₹{u.totalSpend.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          {u.orderCount} order{u.orderCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="col-span-12 mt-4 md:mt-0 md:col-span-2 flex justify-end space-x-2">
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
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                <span className="text-gray-500">Email Verified:</span>{' '}
                                {u.emailVerified ? 'Yes' : 'No'}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Sliders size={18} className="mr-2" /> Activity Summary
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div className="p-2">
                                <div className="bg-blue-50 text-blue-600 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-1">
                                  <Package size={20} />
                                </div>
                                <div className="font-medium">{u.orderCount}</div>
                                <div className="text-xs text-gray-500">Orders</div>
                              </div>
                              <div className="p-2">
                                <div className="bg-green-50 text-green-600 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-1">
                                  <DollarSign size={20} />
                                </div>
                                <div className="font-medium">₹{u.totalSpend.toFixed(2)}</div>
                                <div className="text-xs text-gray-500">Total Spend</div>
                              </div>
                            </div>
                          </div>

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
                                      <span className="text-blue-600">₹{o.totalAmount || o.total}</span>
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {new Date(o.date || o.createdAt).toLocaleDateString()}
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