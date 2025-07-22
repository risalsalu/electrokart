import React, { useEffect, useState } from "react";
import {Users, ShoppingCart, Package, Eye, RefreshCw, DollarSign, BarChart3, Truck, CheckCircle, Clock, XCircle} from "lucide-react";

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
      const [products, users, orders] = await Promise.all([
        fetch('http://localhost:3002/products').then(r => r.json()),
        fetch('http://localhost:3002/users').then(r => r.json()),
        fetch('http://localhost:3002/orders').then(r => r.json())
      ]);
      setData({ products, users, orders });
      calculateDailyStats(orders);
      calculateProductCategories(products);
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

const sortedDailyStats = Object.values(dailyData)
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(-7); // Show only last 7 days

    
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

    // Convert to array and sort by count
    const sortedCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    setProductCategories(sortedCategories);
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

  // Color palette for charts
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  const RevenueChart = () => {
    if (!dailyStats.length) return <div className="text-center text-gray-500">No revenue data available</div>;
    
    const maxRevenue = Math.max(...dailyStats.map(day => day.revenue), 1);
    const minRevenue = Math.min(...dailyStats.map(day => day.revenue), 0);
    const range = maxRevenue - minRevenue;

    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h3>
        <div className="relative h-64">
          <svg width="100%" height="100%">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <g key={y}>
                <line 
                  x1="40" y1={`${20 + y}%`} 
                  x2="95%" y2={`${20 + y}%`} 
                  stroke="#e5e7eb" strokeWidth="1" 
                />
                <text 
                  x="30" y={`${20 + y}%`} 
                  textAnchor="end" 
                  dominantBaseline="middle" 
                  className="text-xs fill-gray-500"
                >
                  ${Math.round(minRevenue + (range * (100 - y) / 100))}
                </text>
              </g>
            ))}
            
            {/* X-axis labels */}
            {dailyStats.map((day, index) => (
              <text
                key={index}
                x={`${40 + (index / (dailyStats.length - 1)) * 55}%`}
                y="95%"
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {day.date}
              </text>
            ))}
            
            {/* Line path */}
            <path
              d={dailyStats.map((day, index) => {
                const x = 40 + (index / (dailyStats.length - 1)) * 55;
                const y = 20 + ((maxRevenue - day.revenue) / range) * 80;
                return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
              }).join(' ')}
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="3"
            />
            
            {/* Area fill */}
            <path
              d={dailyStats.map((day, index) => {
                const x = 40 + (index / (dailyStats.length - 1)) * 55;
                const y = 20 + ((maxRevenue - day.revenue) / range) * 80;
                return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
              }).join(' ') + ` L 95% 100% L 40% 100% Z`}
              fill="url(#revenueGradient)"
            />
            
            {/* Data points */}
            {dailyStats.map((day, index) => {
              const x = 40 + (index / (dailyStats.length - 1)) * 55;
              const y = 20 + ((maxRevenue - day.revenue) / range) * 80;
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4" 
                    fill="#3B82F6" 
                    stroke="white" 
                    strokeWidth="2"
                  />
                  <text
                    x={`${x}%`}
                    y={`${y - 10}%`}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-700"
                  >
                    ${day.revenue.toFixed(2)}
                  </text>
                </g>
              );
            })}
            
            <defs>
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  const CategoryPieChart = () => {
    if (!productCategories.length) return <div className="text-center text-gray-500">No category data available</div>;
    
    const total = productCategories.reduce((sum, cat) => sum + cat.count, 0);
    let startAngle = 0;
    
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
        <div className="relative h-64 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 100 100">
            {productCategories.map((category, index) => {
              const percentage = (category.count / total) * 100;
              const endAngle = startAngle + (percentage / 100) * 360;
              
              // Calculate arc path
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);
              
              const largeArcFlag = percentage > 50 ? 1 : 0;
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              startAngle = endAngle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="0.5"
                />
              );
            })}
            
            {/* Center circle */}
            <circle cx="50" cy="50" r="15" fill="white" />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-xs font-semibold">
              {total} Products
            </text>
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="flex flex-wrap justify-center gap-2">
              {productCategories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-xs text-gray-700">
                    {category.name} ({category.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
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
        <RefreshCw className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

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
                <RevenueChart />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <CategoryPieChart />
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <RevenueChart />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <CategoryPieChart />
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