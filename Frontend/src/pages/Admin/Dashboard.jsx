import React, { useEffect, useState } from 'react';
import { ShoppingCart, Users, TrendingUp, MessageSquare } from 'lucide-react';
import StatCard from '../../components/Admin/StatCard';
import RecentOrders from '../../components/Admin/RecentOrders';
import TopProducts from '../../components/Admin/TopProducts';
import { useFirestore } from '../../hooks/useFirestore';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    topProduct: '',
    recentFeedback: 0,
  });

  const { documents: orders } = useFirestore('orders');
  const { documents: users } = useFirestore('users');
  const { documents: feedback } = useFirestore('feedback');
  const { documents: products } = useFirestore('products');

  useEffect(() => {
    if (orders && users && feedback) {
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      setStats({
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue.toFixed(2),
        avgOrderValue: avgOrderValue.toFixed(2),
        topProduct: products?.[0]?.name || 'N/A',
        recentFeedback: feedback.length,
      });
    }
  }, [orders, users, feedback, products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={TrendingUp}
          color="amber"
          trend="+23%"
        />
        <StatCard
          title="Customer Feedback"
          value={stats.recentFeedback}
          icon={MessageSquare}
          color="purple"
          trend="+5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrders orders={orders?.slice(0, 5) || []} />
        </div>

        {/* Top Products */}
        <div>
          <TopProducts products={products?.slice(0, 5) || []} />
        </div>
      </div>
    </div>
  );
}