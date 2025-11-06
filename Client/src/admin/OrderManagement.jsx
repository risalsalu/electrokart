import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import orderService from "../services/orderService";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [editingStatus, setEditingStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      if (!Array.isArray(data)) throw new Error("Invalid response");
      const formatted = data.map((order) => ({
        id: order.id || order.orderId || "",
        customerName:
          order.userName ||
          order.user?.userName ||
          order.user?.name ||
          order.customerName ||
          "Unknown User",
        customerEmail:
          order.userEmail ||
          order.user?.email ||
          order.customerEmail ||
          order.email ||
          "N/A",
        items: order.items || [],
        total: order.total || order.totalAmount || 0,
        status: order.status || "Pending",
        date: order.date || order.createdAt || new Date().toISOString(),
      }));
      setOrders(formatted);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setEditingStatus((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const updateOrderStatus = async (orderId) => {
    const newStatus = editingStatus[orderId];
    if (!orderId) return toast.error("Invalid order ID");
    if (!newStatus) return toast.error("Select a status");
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setEditingStatus((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm?.toLowerCase() || "";
    const status = statusFilter?.toLowerCase() || "all";
    const idMatch = order?.id?.toString()?.toLowerCase()?.includes(search);
    const nameMatch = order?.customerName?.toLowerCase()?.includes(search);
    const matchesSearch = idMatch || nameMatch;
    const matchesStatus =
      status === "all" || order?.status?.toLowerCase() === status;
    return matchesSearch && matchesStatus;
  });

  const viewOrderDetails = (order) => setSelectedOrder(order);
  const closeOrderDetails = () => setSelectedOrder(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
            <p className="text-gray-600 mt-1">View and manage customer orders</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "There are currently no orders in the system"}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items[0]?.productName ||
                            order.items[0]?.name ||
                            ""}
                          {order.items.length > 1
                            ? ` + ${order.items.length - 1} more`
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className={`block w-full pl-3 pr-10 py-1 text-base border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${getStatusColor(
                            editingStatus[order.id] || order.status
                          )}`}
                          value={editingStatus[order.id] || order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => updateOrderStatus(order.id)}
                            className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-gray-600 bg-gray-50 px-3 py-1 rounded-md hover:bg-gray-100"
                          >
                            👁
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
          <div className="bg-white p-8 rounded-xl max-w-xl w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Order #{selectedOrder.id}
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Customer:</span>{" "}
              {selectedOrder.customerName}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Email:</span>{" "}
              {selectedOrder.customerEmail}
            </p>
            <p className="text-gray-700 mb-3">
              <span className="font-semibold">Total:</span> ₹
              {selectedOrder.total.toFixed(2)}
            </p>
            <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.productName || item.name} × {item.quantity} – ₹
                  {(item.unitPrice || 0) * (item.quantity || 1)}
                </li>
              ))}
            </ul>
            <div className="text-right mt-6">
              <button
                onClick={closeOrderDetails}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
