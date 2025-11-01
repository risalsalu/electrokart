import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import userService from "../services/userService";
import {
  Users,
  Search,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  User,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.username || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.phoneNumber || "").includes(term)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" /> User Management
      </h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-3" />
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No users found.</div>
        ) : (
          filteredUsers.map((u) => {
            const isOpen = expanded[u.id];
            const status = u.isBlocked ? "Blocked" : "Active";
            return (
              <React.Fragment key={u.id}>
                <div className="grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50">
                  <div className="col-span-1">
                    <button
                      onClick={() =>
                        setExpanded((s) => ({ ...s, [u.id]: !isOpen }))
                      }
                      className="text-gray-500 hover:text-blue-600"
                    >
                      {isOpen ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  <div className="col-span-3 flex items-center">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="font-medium">
                        {u.fullName || u.username || u.email || "N/A"}
                      </div>
                      {u.phoneNumber && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone size={14} className="mr-1" /> {u.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-4 flex items-center text-sm">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    {u.email}
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end space-x-2">
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        status === "Active"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {status === "Active" ? "Block" : "Unblock"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="bg-gray-50 p-4 border-b text-sm text-gray-700">
                    <div>ID: {u.id}</div>
                    <div>Role: {u.role}</div>
                    <div>Email: {u.email}</div>
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserManagement;
