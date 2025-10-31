import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminService from "../services/adminService";
import { Users, ShoppingCart, Package, Eye, DollarSign, BarChart3, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const AdminDashboard = () => {
  const [data, setData] = useState({ products: [], users: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [dailyStats, setDailyStats] = useState([]);
  const [productCategories, setProductCategories] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        adminService.getAllProducts(),
        adminService.getAllUsers(),
        adminService.getAllOrders()
      ]);

      const products = productsRes?.data || productsRes;
      const users = usersRes?.data || usersRes;
      const orders = ordersRes?.data || ordersRes;

      setData({ products, users, orders });
      calculateDailyStats(orders);
      calculateProductCategories(products);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateDailyStats = (orders) => {
    const dailyData = {};
    
    orders.forEach((order) => {
      const date = new Date(order.date || Date.now()).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          orders: 0,
          revenue: 0,
        };
      }
      dailyData[date].orders += 1;
      dailyData[date].revenue += (parseFloat(order.total || order.totalAmount || order.amount || 0));
    });

    const sortedDailyStats = Object.values(dailyData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); 

    setDailyStats(sortedDailyStats);
  };

  const calculateProductCategories = (products) => {
    const categoryCount = {};
    
    products.forEach((product) => {
      const category = product.category || 'Uncategorized';
      if (!categoryCount[category]) {
        categoryCount[category] = 0;
      }
      categoryCount[category]++;
    });

    const sortedCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    setProductCategories(sortedCategories);
  };

  useEffect(() => { fetchData(); }, []);

  const orderStatusCounts = data.orders.reduce((acc, order) => {
    const status = order.status?.toLowerCase() || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const metrics = {
    totalProducts: data.products.length,
    totalUsers: data.users.length,
    totalOrders: data.orders.length,
    totalRevenue: data.orders.reduce(
      (sum, order) => sum + (parseFloat(order.total || order.totalAmount || order.amount || 0)),
      0
    ),
    orderStatus: {
      pending: orderStatusCounts.pending || 0,
      shipped: orderStatusCounts.shipped || 0,
      delivered: orderStatusCounts.delivered || 0,
      cancelled: orderStatusCounts.cancelled || 0
    }
  };

  const RevenueBarChart = () => {
    if (!dailyStats.length) return <div className="text-center text-gray-500">No revenue data available</div>;
    
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="revenue" 
                name="Revenue"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Color map for the order status pie chart
  const statusColorsMap = {
    pending: '#F59E0B', // yellow
    shipped: '#3B82F6', // blue
    delivered: '#10B981', // green
    cancelled: '#EF4444', // red
  };

  const OrderStatusPieChart = () => {
    const orderStatusData = [
      { name: 'Pending', value: metrics.orderStatus.pending },
      { name: 'Shipped', value: metrics.orderStatus.shipped },
      { name: 'Delivered', value: metrics.orderStatus.delivered },
      { name: 'Cancelled', value: metrics.orderStatus.cancelled }
    ].filter(item => item.value > 0);

    if (!orderStatusData.length) return <div className="text-center text-gray-500">No order data available</div>;
    
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={statusColorsMap[entry.name.toLowerCase()]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Orders']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const UserGrowthChart = () => {
    const userGrowthData = [
      { month: 'Jan', users: 120 },
      { month: 'Feb', users: 180 },
      { month: 'Mar', users: 220 },
      { month: 'Apr', users: 300 },
      { month: 'May', users: 400 },
      { month: 'Jun', users: 520 },
    ];

    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">User Growth</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="users" 
                name="Users"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const ProductCategoryChart = () => {
    if (!productCategories.length) return <div className="text-center text-gray-500">No category data available</div>;
    
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={productCategories.slice(0, 5)}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar 
                dataKey="count" 
                name="Products"
                fill="#10B981"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const AverageOrderValueChart = () => {
    const avgOrderData = dailyStats.map(day => ({
      date: day.date,
      avgValue: day.orders > 0 ? (day.revenue / day.orders) : 0
    }));

    if (!avgOrderData.length) return <div className="text-center text-gray-500">No order data available</div>;
    
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Average Order Value</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={avgOrderData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Average Value']}
              />
              <Bar 
                dataKey="avgValue" 
                name="Average Value"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const OrdersTrendChart = () => {
    if (!dailyStats.length) return <div className="text-center text-gray-500">No order data available</div>;
    
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Daily Orders Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="orders" 
                name="Orders"
                fill="#EC4899"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const statusCards = [
    { 
      title: "Pending", 
      value: metrics.orderStatus.pending, 
      icon: <Clock size={28} />, 
      bg: "from-yellow-400 to-yellow-600" 
    },
    { 
      title: "Shipped", 
      value: metrics.orderStatus.shipped, 
      icon: <Truck size={28} />, 
      bg: "from-blue-400 to-blue-600" 
    },
    { 
      title: "Delivered", 
      value: metrics.orderStatus.delivered, 
      icon: <CheckCircle size={28} />, 
      bg: "from-green-400 to-green-600" 
    },
    { 
      title: "Cancelled", 
      value: metrics.orderStatus.cancelled, 
      icon: <XCircle size={28} />, 
      bg: "from-red-400 to-red-600" 
    }
  ];

  const cards = [
    { title: "Products", value: metrics.totalProducts, icon: <Package size={28} />, bg: "from-indigo-400 to-indigo-600" },
    { title: "Users", value: metrics.totalUsers, icon: <Users size={28} />, bg: "from-purple-400 to-purple-600" },
    { title: "Orders", value: metrics.totalOrders, icon: <ShoppingCart size={28} />, bg: "from-pink-400 to-pink-600" },
    { title: "Revenue", value: `$${metrics.totalRevenue.toLocaleString()}`, icon: <DollarSign size={28} />, bg: "from-teal-400 to-teal-600" }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> }
  ];

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const recentOrders = data.orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Order Details</h3>
                <button 
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-700">Order Information</h4>
                  <p className="text-sm text-gray-600">ID: #{selectedOrder.id}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Customer</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.customerName || 'Guest'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail || 'N/A'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Products</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items && selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Status: 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal: ${selectedOrder.subtotal?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm text-gray-600">Shipping: ${selectedOrder.shipping?.toFixed(2) || '0.00'}</p>
                  <p className="text-lg font-semibold">Total: ${selectedOrder.total?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Comprehensive overview of your store</p>
          </div>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {cards.map((card, index) => (
                <div key={index} className={`bg-gradient-to-r ${card.bg} p-4 rounded-xl shadow text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{card.title}</p>
                      <p className="mt-1 text-xl font-bold">{card.value}</p>
                    </div>
                    {card.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statusCards.map((card, index) => (
                <div key={index} className={`bg-gradient-to-r ${card.bg} p-4 rounded-xl shadow text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{card.title}</p>
                      <p className="mt-1 text-xl font-bold">{card.value}</p>
                    </div>
                    {card.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <RevenueBarChart />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <OrderStatusPieChart />
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <UserGrowthChart />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <ProductCategoryChart />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <AverageOrderValueChart />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <OrdersTrendChart />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order, index) => {
                      const status = order.status?.toLowerCase() || 'pending';
                      const statusColors = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        shipped: 'bg-blue-100 text-blue-800',
                        delivered: 'bg-green-100 text-green-800',
                        cancelled: 'bg-red-100 text-red-800'
                      };
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id || index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerName || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${(order.total || order.totalAmount || order.amount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => viewOrderDetails(order)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;