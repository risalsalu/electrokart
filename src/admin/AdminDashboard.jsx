import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  User, 
  Package, 
  ShoppingCart, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Activity,
  Calendar,
  BarChart2,
  CreditCard,
  Users,
  Settings,
  Download
} from "lucide-react";
import { Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    usersChange: 0,
    revenueChange: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3002/users"),
        axios.get("http://localhost:3002/products"),
        axios.get("http://localhost:3002/orders"),
      ]);

      // Calculate total revenue
      const totalRevenue = ordersRes.data.reduce((total, order) => {
        const orderTotal = order.items?.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0) || 0;
        return total + orderTotal;
      }, 0);

      // Get recent 5 orders
      const sortedOrders = [...ordersRes.data].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);

      // Get top 5 selling products
      const productSales = {};
      ordersRes.data.forEach(order => {
        order.items?.forEach(item => {
          productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        });
      });

      const topProductsList = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([productId, sales]) => {
          const product = productsRes.data.find(p => p.id === productId);
          return {
            ...product,
            sales
          };
        });

      setMetrics({
        users: usersRes.data.length,
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        revenue: totalRevenue.toFixed(2),
        usersChange: 12,
        revenueChange: 8.5,
      });

      setRecentOrders(sortedOrders);
      setTopProducts(topProductsList);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Chart data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1900, 1500, 2200, 1800, 2500, 3000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Orders',
        data: [45, 60, 50, 70, 65, 80, 90],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Home', 'Books', 'Other'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [300, 150, 100, 50, 75],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const cards = [
    {
      title: "Total Users",
      value: metrics.users,
      change: metrics.usersChange,
      icon: <Users className="w-6 h-6" />,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
    },
    {
      title: "Total Products",
      value: metrics.products,
      change: 0,
      icon: <Package className="w-6 h-6" />,
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },
    {
      title: "Orders Placed",
      value: metrics.orders,
      change: 0,
      icon: <ShoppingCart className="w-6 h-6" />,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-100",
    },
    {
      title: "Revenue",
      value: `$${metrics.revenue}`,
      change: metrics.revenueChange,
      icon: <DollarSign className="w-6 h-6" />,
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
              <Calendar className="w-5 h-5 mr-2" />
              Last 30 days
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl border ${card.border} ${card.bg} p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${card.bg} ${card.text}`}>
                  {card.icon}
                </div>
              </div>
              {card.change !== 0 && (
                <div className="mt-4 flex items-center">
                  {card.change > 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`ml-1 text-sm font-medium ${card.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(card.change)}% {card.change > 0 ? 'increase' : 'decrease'} from last month
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <div className="flex items-center text-sm text-indigo-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>12% vs last month</span>
              </div>
            </div>
            <div className="h-80">
              <Line data={salesData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Orders Overview</h2>
              <div className="flex items-center text-sm text-green-600">
                <Activity className="w-4 h-4 mr-1" />
                <span>8% vs last month</span>
              </div>
            </div>
            <div className="h-80">
              <Bar data={ordersData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sales by Category</h2>
              <div className="flex items-center text-sm text-purple-600">
                <BarChart2 className="w-4 h-4 mr-1" />
                <span>Top categories</span>
              </div>
            </div>
            <div className="h-80">
              <Pie data={categoryData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.customerName || 'Anonymous'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {order.status || 'processing'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        ${order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all orders
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm text-gray-500">{product.category || 'Uncategorized'}</p>
                      <p className="text-xs font-semibold text-green-600">{product.sales} sold</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all products
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;