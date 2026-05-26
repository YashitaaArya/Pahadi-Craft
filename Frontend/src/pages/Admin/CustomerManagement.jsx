import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import CustomerTable from '../../components/Admin/CustomerTable';
import CustomerDetail from '../../components/Admin/CustomerDetail';
import Modal from '../../components/Admin/Modal';
import { useFirestore } from '../../hooks/useFirestore';

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const { documents: customers, loading } = useFirestore('users');

  const filteredCustomers = useMemo(() => {
    return customers?.filter((customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
    ) || [];
  }, [customers, searchTerm]);

  const customerStats = useMemo(() => {
    return {
      total: customers?.length || 0,
      active: customers?.filter((c) => c.isActive !== false).length || 0,
      newThisMonth: customers?.filter((c) => {
        const createdAt = new Date(c.createdAt?.seconds * 1000 || 0);
        const now = new Date();
        return (
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear()
        );
      }).length || 0,
      totalSpent: customers?.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toFixed(2) || 0,
    };
  }, [customers]);

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetail(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage and view customer information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-green-600">{customerStats.active}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-blue-600">{customerStats.newThisMonth}</p>
          <p className="text-sm text-gray-600">New This Month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-amber-600">₹{customerStats.totalSpent}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      {/* Customers Table */}
      <CustomerTable
        customers={filteredCustomers}
        onViewDetails={handleViewDetails}
        loading={loading}
      />

      {/* Customer Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Customer Details">
        {selectedCustomer && <CustomerDetail customer={selectedCustomer} />}
      </Modal>
    </div>
  );
}