import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import OrderTable from '../../components/Admin/OrderTable';
import OrderDetail from '../../components/Admin/OrderDetail';
import Modal from '../../components/Admin/Modal';
import { useFirestore } from '../../hooks/useFirestore';

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const { documents: orders, loading } = useFirestore('orders');

  const filteredOrders = useMemo(() => {
    return orders?.filter((order) => {
      const matchesSearch =
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    }) || [];
  }, [orders, searchTerm, filterStatus]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const orderStats = useMemo(() => {
    return {
      pending: orders?.filter((o) => o.status === 'pending').length || 0,
      processing: orders?.filter((o) => o.status === 'processing').length || 0,
      shipped: orders?.filter((o) => o.status === 'shipped').length || 0,
      delivered: orders?.filter((o) => o.status === 'delivered').length || 0,
      cancelled: orders?.filter((o) => o.status === 'cancelled').length || 0,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and shipments</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Pending', count: orderStats.pending, color: 'yellow' },
          { label: 'Processing', count: orderStats.processing, color: 'blue' },
          { label: 'Shipped', count: orderStats.shipped, color: 'purple' },
          { label: 'Delivered', count: orderStats.delivered, color: 'green' },
          { label: 'Cancelled', count: orderStats.cancelled, color: 'red' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4 text-center`}
          >
            <p className={`text-2xl font-bold text-${stat.color}-900`}>{stat.count}</p>
            <p className={`text-xs text-${stat.color}-700`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Email, or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        onViewDetails={handleViewDetails}
        loading={loading}
      />

      {/* Order Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Order Details">
        {selectedOrder && <OrderDetail order={selectedOrder} />}
      </Modal>
    </div>
  );
}