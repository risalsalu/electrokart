import React, { useEffect, useState } from "react";
import { 
  Users, ShoppingCart, Package, Eye, 
  RefreshCw, DollarSign, BarChart3, Truck, 
  CheckCircle, Clock, XCircle, ChevronDown, ChevronUp
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState({ products: [], users: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [dailyStats, setDailyStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [products, users, orders] = await Promise.all([
        fetch('http://localhost:3002/products').then(r => r.json()),
        fetch('http://localhost:3002/users').then(r => r.json()),
        fetch('http://localhost:3002/orders').then(r => r.json())
      ]);
      setData({ products, users, orders });
      calculateDailyStats(orders);
      calculateTopProducts(orders);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      dailyData[date].revenue += order.total || 0;
    });

    const sortedDailyStats = Object.values(dailyData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    setDailyStats(sortedDailyStats);
  };

  const calculateTopProducts = (orders) => {
    const productCount = {};
    
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productCount[item.id]) {
          productCount[item.id] = {
            ...item,
            count: 0,
          };
        }
        productCount[item.id].count += item.quantity || 1;
      });
    });

    const sortedProducts = Object.values(productCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopProducts(sortedProducts);
  };

  useEffect(() => { fetchData(); }, []);

  // Calculate order status counts
  const orderStatusCounts = data.orders.reduce((acc, order) => {
    const status = order.status?.toLowerCase() || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const metrics = {
    totalProducts: data.products.length,
    totalUsers: data.users.length,
    totalOrders: data.orders.length,
    totalRevenue: data.orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0),
    orderStatus: {
      pending: orderStatusCounts.pending || 0,
      shipped: orderStatusCounts.shipped || 0,
      delivered: orderStatusCounts.delivered || 0,
      cancelled: orderStatusCounts.cancelled || 0
    }
  };

  const Chart = ({ data: chartData, title, type = 'line', color = "rgb(59, 130, 246)" }) => {
    if (!chartData?.length) return <div className="text-center text-gray-500">No data available</div>;
    
    // Ensure all values are valid numbers
    const validData = chartData.map(item => ({
      ...item,
      value: Number(item.value) || 0
    }));
    
    const maxValue = Math.max(1, ...validData.map(d => d.value));

    if (type === 'bar') {
      return (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="space-y-3">
            {validData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: color
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-semibold">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Line chart
    const range = maxValue || 1;
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="relative h-64">
          <svg width="100%" height="100%">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={y} x1="40" y1={`${20 + (y * 2)}%`} x2="95%" y2={`${20 + (y * 2)}%`} stroke="#e5e7eb" strokeWidth="1" />
            ))}
            
            <path
              d={validData.map((point, index) => {
                const x = 40 + (index / Math.max(1, (validData.length - 1))) * 55;
                const y = 20 + ((maxValue - point.value) / range) * 60;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none" stroke={color} strokeWidth="3"
            />
            
            <path
              d={validData.map((point, index) => {
                const x = 40 + (index / Math.max(1, (validData.length - 1))) * 55;
                const y = 20 + ((maxValue - point.value) / range) * 60;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ') + ` L 95 80 L 40 80 Z`}
              fill="url(#gradient)"
            />
            
            {validData.map((point, index) => {
              const x = 40 + (index / Math.max(1, (validData.length - 1))) * 55;
              const y = 20 + ((maxValue - point.value) / range) * 60;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4" 
                  fill={color} 
                  stroke="white" 
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const getChartData = () => {
    if (!data.orders?.length || !data.products?.length) {
      return {
        orders: [],
        revenue: [],
        topProducts: [],
        statusDistribution: [
          { label: 'Pending', value: 0 },
          { label: 'Shipped', value: 0 },
          { label: 'Delivered', value: 0 },
          { label: 'Cancelled', value: 0 }
        ]
      };
    }

    // Daily stats for orders and revenue
    const dailyOrders = dailyStats.map(day => ({
      label: day.date,
      value: day.orders
    }));

    const dailyRevenue = dailyStats.map(day => ({
      label: day.date,
      value: day.revenue
    }));

    // Top products
    const topProductsChart = topProducts.map(product => ({
      label: product.name.substring(0, 15),
      value: product.count
    }));

    return {
      orders: dailyOrders,
      revenue: dailyRevenue,
      topProducts: topProductsChart,
      statusDistribution: [
        { label: 'Pending', value: Number(metrics.orderStatus.pending) || 0 },
        { label: 'Shipped', value: Number(metrics.orderStatus.shipped) || 0 },
        { label: 'Delivered', value: Number(metrics.orderStatus.delivered) || 0 },
        { label: 'Cancelled', value: Number(metrics.orderStatus.cancelled) || 0 }
      ]
    };
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
        <RefreshCw className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const chartData = getChartData();
  const recentOrders = data.orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                      {selectedOrder.items.map((item, index) => (
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
          <button 
            onClick={fetchData} 
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
            Refresh Data
          </button>
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
                <Chart 
                  data={chartData.orders} 
                  title="Daily Orders" 
                  color="#3b82f6"
                />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <Chart 
                  data={chartData.revenue} 
                  title="Daily Revenue ($)" 
                  color="#10b981"
                />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <Chart 
                  data={chartData.topProducts} 
                  title="Top Selling Products" 
                  type="bar"
                  color="#8b5cf6"
                />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <Chart 
                  data={chartData.statusDistribution} 
                  title="Order Status Distribution" 
                  type="bar"
                  color="#ec4899"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Chart 
                data={chartData.topProducts} 
                title="Top Selling Products" 
                type="bar"
                color="#8b5cf6"
              />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Chart 
                data={chartData.statusDistribution} 
                title="Order Status" 
                type="bar"
                color="#ec4899"
              />
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
                            ${(order.total || 0).toLocaleString()}
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