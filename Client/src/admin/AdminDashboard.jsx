import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminService from "../services/adminService";
import { Users, ShoppingCart, Package, BarChart3, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

const AdminDashboard = () => {
  const [data, setData] = useState({ products: [], users: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          adminService.getAllProducts(),
          adminService.getAllUsers(),
          adminService.getAllOrders(),
        ]);

        const products = productsRes?.data || productsRes;
        const users = usersRes?.data || usersRes;
        const orders = ordersRes?.data || ordersRes;

        setData({ products, users, orders });
        calculateDailyStats(orders);
        calculateTopProducts(orders, products);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateDailyStats = (orders) => {
    const dailyData = {};
    orders.forEach((order) => {
      const date = new Date(order.date || order.createdAt || Date.now()).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = { date, orders: 0, revenue: 0 };
      }
      dailyData[date].orders += 1;
      dailyData[date].revenue += parseFloat(order.total || order.totalAmount || 0);
    });
    const sorted = Object.values(dailyData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
    setDailyStats(sorted);
  };

  const calculateTopProducts = (orders, products) => {
    const productCount = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const id = item.productId;
        productCount[id] = (productCount[id] || 0) + item.quantity;
      });
    });
    const top = products
      .filter((p) => productCount[p.id])
      .map((p) => ({
        name: p.name,
        sales: productCount[p.id],
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    setTopProducts(top);
  };

  const orderStatusCounts = data.orders.reduce((acc, order) => {
    const status = order.status?.toLowerCase() || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const metrics = {
    totalProducts: data.products.length,
    totalUsers: data.users.length,
    totalOrders: data.orders.length,
    totalRevenue: data.orders.reduce(
      (sum, order) => sum + parseFloat(order.total || order.totalAmount || 0),
      0
    ),
    orderStatus: {
      pending: orderStatusCounts.pending || 0,
      shipped: orderStatusCounts.shipped || 0,
      delivered: orderStatusCounts.delivered || 0,
      cancelled: orderStatusCounts.cancelled || 0,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Products</p>
              <p className="text-xl font-semibold">{metrics.totalProducts}</p>
            </div>
            <Package size={28} />
          </div>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Users</p>
              <p className="text-xl font-semibold">{metrics.totalUsers}</p>
            </div>
            <Users size={28} />
          </div>
        </div>
        <div className="bg-pink-500 text-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Orders</p>
              <p className="text-xl font-semibold">{metrics.totalOrders}</p>
            </div>
            <ShoppingCart size={28} />
          </div>
        </div>
        <div className="bg-teal-500 text-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Revenue</p>
              <p className="text-xl font-semibold">₹{metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <BarChart3 size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-500 text-white p-4 rounded-xl shadow flex justify-between">
          <div>
            <p className="text-sm">Pending</p>
            <p className="text-xl font-semibold">{metrics.orderStatus.pending}</p>
          </div>
          <Clock size={28} />
        </div>
        <div className="bg-blue-400 text-white p-4 rounded-xl shadow flex justify-between">
          <div>
            <p className="text-sm">Shipped</p>
            <p className="text-xl font-semibold">{metrics.orderStatus.shipped}</p>
          </div>
          <Truck size={28} />
        </div>
        <div className="bg-green-500 text-white p-4 rounded-xl shadow flex justify-between">
          <div>
            <p className="text-sm">Delivered</p>
            <p className="text-xl font-semibold">{metrics.orderStatus.delivered}</p>
          </div>
          <CheckCircle size={28} />
        </div>
        <div className="bg-red-500 text-white p-4 rounded-xl shadow flex justify-between">
          <div>
            <p className="text-sm">Cancelled</p>
            <p className="text-xl font-semibold">{metrics.orderStatus.cancelled}</p>
          </div>
          <XCircle size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h3>
          {dailyStats.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v.toFixed(2)}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No data available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          {topProducts.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(v) => [`${v}`, "Units Sold"]} />
                <Bar dataKey="sales" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No product data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
