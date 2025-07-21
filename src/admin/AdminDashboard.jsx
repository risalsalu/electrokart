import React, { useEffect, useState } from "react";
import { 
  TrendingUp, ShoppingBag, Users, ShoppingCart, Heart, Package, Eye, RefreshCw, 
  Calendar, DollarSign, ArrowUp, ArrowDown, BarChart3
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState({ products: [], users: [], orders: [], wishlist: [], cart: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        'products', 'users', 'orders', 'wishlist', 'cart'
      ].map(endpoint => fetch(`http://localhost:3002/${endpoint}`).then(r => r.json())));
      
      setData({
        products: responses[0], users: responses[1], orders: responses[2],
        wishlist: responses[3], cart: responses[4]
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const metrics = {
    totalProducts: data.products.length,
    totalUsers: data.users.length,
    totalOrders: data.orders.length,
    totalWishlistItems: data.wishlist.length,
    totalCartItems: data.cart.length,
    totalRevenue: data.orders.reduce((sum, order) => sum + (parseFloat(order.total) || parseFloat(order.amount) || 0), 0)
  };

  const Chart = ({ data: chartData, title, type = 'line' }) => {
    if (!chartData?.length) return <div className="text-center text-gray-500">No data available</div>;
    
    const maxValue = Math.max(...chartData.map(d => d.value));
    
    if (type === 'bar') {
      return (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-semibold text-gray-700">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (type === 'donut') {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const colors = ['#3b82f6', '#ec4899', '#22c55e', '#f59e0b', '#8b5cf6'];
      let cumulativePercentage = 0;

      return (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                {chartData.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const strokeDasharray = `${(percentage / 100) * 502.65} 502.65`;
                  const strokeDashoffset = -cumulativePercentage * 5.0265;
                  cumulativePercentage += percentage;
                  
                  return (
                    <circle
                      key={index} cx="100" cy="100" r="80" fill="none"
                      stroke={colors[index % colors.length]} strokeWidth="20"
                      strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round" className="transition-all duration-1000"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="text-sm text-gray-600">{item.label}: {item.value}</span>
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="relative h-64">
          <svg width="100%" height="100%">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={y} x1="40" y1={`${20 + (y * 2)}%`} x2="95%" y2={`${20 + (y * 2)}%`} stroke="#e5e7eb" strokeWidth="1" />
            ))}
            
            <path
              d={chartData.map((point, index) => {
                const x = 40 + (index / (chartData.length - 1)) * 55;
                const y = 20 + ((maxValue - point.value) / range) * 60;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none" stroke="rgb(59, 130, 246)" strokeWidth="3"
            />
            
            <path
              d={chartData.map((point, index) => {
                const x = 40 + (index / (chartData.length - 1)) * 55;
                const y = 20 + ((maxValue - point.value) / range) * 60;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ') + ` L 95 80 L 40 80 Z`}
              fill="url(#gradient)"
            />
            
            {chartData.map((point, index) => (
              <circle
                key={index}
                cx={40 + (index / (chartData.length - 1)) * 55}
                cy={20 + ((maxValue - point.value) / range) * 60}
                r="4" fill="rgb(59, 130, 246)" stroke="white" strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </div>
    );
  };

  // Prepare chart data
  const getChartData = () => {
    const ordersByMonth = data.orders.reduce((acc, order) => {
      const month = new Date(order.date || order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const revenueByMonth = data.orders.reduce((acc, order) => {
      const month = new Date(order.date || order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + (parseFloat(order.total) || parseFloat(order.amount) || 0);
      return acc;
    }, {});

    const months = Object.keys(ordersByMonth).sort();
    const topProducts = data.products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);

    return {
      orders: months.map(month => ({ label: month, value: ordersByMonth[month] })),
      revenue: months.map(month => ({ label: month, value: revenueByMonth[month] })),
      topProducts: topProducts.map(p => ({ label: (p.name || p.title || 'Unknown').substring(0, 15), value: p.sold || 0 })),
      distribution: [
        { label: 'Products', value: metrics.totalProducts },
        { label: 'Wishlist', value: metrics.totalWishlistItems },
        { label: 'Cart Items', value: metrics.totalCartItems }
      ]
    };
  };

  const cards = [
    { title: "Total Products", value: metrics.totalProducts, icon: <Package size={28} />, bg: "from-blue-400 to-blue-600" },
    { title: "Total Users", value: metrics.totalUsers, icon: <Users size={28} />, bg: "from-purple-400 to-purple-600" },
    { title: "Total Orders", value: metrics.totalOrders, icon: <ShoppingCart size={28} />, bg: "from-green-400 to-green-600" },
    { title: "Revenue", value: `$${metrics.totalRevenue.toLocaleString()}`, icon: <DollarSign size={28} />, bg: "from-yellow-400 to-yellow-600" },
    { title: "Wishlist Items", value: metrics.totalWishlistItems, icon: <Heart size={28} />, bg: "from-pink-400 to-pink-600" },
    { title: "Cart Items", value: metrics.totalCartItems, icon: <ShoppingBag size={28} />, bg: "from-indigo-400 to-indigo-600" }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-xl text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const recentOrders = data.orders.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)).slice(0, 5);
  const topProducts = data.products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cards.map((card, index) => (
                <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className={`bg-gradient-to-r ${card.bg} p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/80">{card.title}</p>
                        <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
                        <div className="mt-2 flex items-center gap-1">
                          <ArrowUp size={16} className="text-green-200" />
                          <span className="text-sm text-green-200">+12%</span>
                        </div>
                      </div>
                      <div className="text-white/80 group-hover:text-white transition-colors duration-300">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Avg Order Value', value: metrics.totalRevenue > 0 ? (metrics.totalRevenue / metrics.totalOrders).toFixed(0) : 0 },
                { label: 'Conversion Rate', value: `${metrics.totalUsers > 0 ? ((metrics.totalOrders / metrics.totalUsers) * 100).toFixed(1) : 0}%` },
                { label: 'Items per User', value: metrics.totalCartItems > 0 ? (metrics.totalCartItems / metrics.totalUsers).toFixed(1) : 0 },
                { label: 'Products Sold', value: `${metrics.totalProducts > 0 ? ((data.products.filter(p => p.sold > 0).length / metrics.totalProducts) * 100).toFixed(1) : 0}%` }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Chart data={chartData.orders} title="Orders Trend" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Chart data={chartData.revenue} title="Revenue Trend" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Chart data={chartData.topProducts} title="Top Selling Products" type="bar" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Chart data={chartData.distribution} title="Data Distribution" type="donut" />
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {['Order ID', 'Customer', 'Total', 'Date', 'Status'].map(header => (
                      <th key={header} className="text-left py-3 px-4 font-semibold text-gray-700">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">#{order.id || index + 1}</td>
                      <td className="py-4 px-4 text-gray-700">{order.customerName || order.customer || 'Unknown'}</td>
                      <td className="py-4 px-4 text-gray-700 font-semibold">${(order.total || order.amount || 0).toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-700">{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {order.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Top Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProducts.map((product, index) => (
                <div key={product.id || index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">{product.name || product.title}</h3>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Price: ${(product.price || 0).toLocaleString()}</p>
                  <p className="text-gray-600 text-sm">Sold: {product.sold || 0} units</p>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((product.sold || 0) / Math.max(...data.products.map(p => p.sold || 0), 1) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Users Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.users.slice(0, 9).map((user, index) => (
                <div key={user.id || index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name || 'Unknown User'}</h3>
                      <p className="text-gray-600 text-sm">{user.email || 'No email'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;