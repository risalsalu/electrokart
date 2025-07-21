import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Search, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/users");
      setUsers(await Promise.all(res.data.map(async u => {
        const [orders, cart, wishlist] = await Promise.all([
          axios.get(`http://localhost:3002/orders?userId=${u.id}`),
          axios.get(`http://localhost:3002/cart?userId=${u.id}`),
          axios.get(`http://localhost:3002/wishlist?userId=${u.id}`)
        ]);
        const totalSpend = orders.data.reduce((sum,o) => sum + (parseFloat(o.total)||0), 0);
        return { ...u, orders: orders.data, cart: cart.data, wishlist: wishlist.data, totalSpend };
      })));
    } catch (err) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3002/users/${id}`);
      toast.success("User deleted.");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  const filtered = users.filter(u => {
    const term = searchTerm.toLowerCase();
    const match = u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || (u.phone || "").includes(term);
    const roleOk = !roleFilter || u.role === roleFilter;
    return match && roleOk;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/6"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="border rounded shadow">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No users found.</div>
          ) : (
            filtered.map(u => {
              const isOpen = expanded[u.id];
              return (
                <div key={u.id} className="border-b">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100">
                    <div className="flex gap-4 items-center">
                      <button onClick={() => setExpanded(s => ({...s, [u.id]: !isOpen}))}>
                        {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                      </button>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-sm text-gray-600">{u.email}</div>
                      <div className="text-sm text-gray-600">{u.role}</div>
                      <div className="text-sm text-gray-600">Spent: ₹{u.totalSpend.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Orders: {u.orders.length}</div>
                      <div className="text-sm text-gray-600">Cart: {u.cart.length}</div>
                      <div className="text-sm text-gray-600">Wishlist: {u.wishlist.length}</div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800"><Trash2/></button>
                      <button className="text-blue-600 hover:text-blue-800"><Pencil/></button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="bg-white p-4 space-y-4">
                      {u.orders.length > 0 && (
                        <div>
                          <h4 className="font-semibold">Orders</h4>
                          <ul className="space-y-2">
                            {u.orders.map(o => (
                              <li key={o.id} className="text-sm">
                                #{o.id} – ₹{o.total} – {new Date(o.date).toLocaleDateString()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {u.cart.length > 0 && (
                        <div>
                          <h4 className="font-semibold">Cart Items</h4>
                          <ul className="list-disc pl-5 text-sm">
                            {u.cart.map(c => <li key={c.id}>{c.name} (₹{c.price})</li>)}
                          </ul>
                        </div>
                      )}
                      {u.wishlist.length > 0 && (
                        <div>
                          <h4 className="font-semibold">Wishlist Items</h4>
                          <ul className="list-disc pl-5 text-sm">
                            {u.wishlist.map(w => <li key={w.id}>{w.name} (₹{w.price})</li>)}
                          </ul>
                        </div>
                      )}
                      {(!u.orders.length && !u.cart.length && !u.wishlist.length) && (
                        <div className="text-sm text-gray-500">No activity yet.</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
