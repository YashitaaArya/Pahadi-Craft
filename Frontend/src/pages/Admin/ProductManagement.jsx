import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import ProductTable from '../../components/Admin/ProductTable';
import ProductForm from '../../components/Admin/ProductForm';
import Modal from '../../components/Admin/Modal';
import { useFirestore } from '../../hooks/useFirestore';
import { addProduct, updateProduct, deleteProduct } from '../../services/productService';

export default function ProductManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { documents: products, loading: productsLoading } = useFirestore('products');
  const filteredProducts = products?.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddProduct = async (formData) => {
    setLoading(true);
    try {
      await addProduct(formData);
      setMessage('Product added successfully!');
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding product: ' + error.message);
    }
    setLoading(false);
  };

  const handleUpdateProduct = async (formData) => {
    setLoading(true);
    try {
      await updateProduct(editingProduct.id, formData);
      setMessage('Product updated successfully!');
      setEditingProduct(null);
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating product: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await deleteProduct(productId);
        setMessage('Product deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting product: ' + error.message);
      }
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{message}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        loading={productsLoading || loading}
      />

      {/* Product Form Modal */}
      <Modal isOpen={showForm} onClose={handleCloseForm} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          loading={loading}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
}