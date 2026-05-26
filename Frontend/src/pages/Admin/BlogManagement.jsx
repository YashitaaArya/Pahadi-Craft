import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import BlogTable from '../../components/Admin/BlogTable';
import BlogForm from '../../components/Admin/BlogForm';
import Modal from '../../components/Admin/Modal';
import { useFirestore } from '../../hooks/useFirestore';
import { addBlog, updateBlog, deleteBlog } from '../../services/blogService';

export default function BlogManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { documents: blogs, loading: blogsLoading } = useFirestore('blog');
  const filteredBlogs = blogs?.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddBlog = async (formData) => {
    setLoading(true);
    try {
      await addBlog(formData);
      setMessage('Blog post added successfully!');
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding blog: ' + error.message);
    }
    setLoading(false);
  };

  const handleUpdateBlog = async (formData) => {
    setLoading(true);
    try {
      await updateBlog(editingBlog.id, formData);
      setMessage('Blog post updated successfully!');
      setEditingBlog(null);
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating blog: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setLoading(true);
      try {
        await deleteBlog(blogId);
        setMessage('Blog post deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting blog: ' + error.message);
      }
      setLoading(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Manage your blog content</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" />
          New Post
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
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      {/* Blog Table */}
      <BlogTable
        blogs={filteredBlogs}
        onEdit={handleEditBlog}
        onDelete={handleDeleteBlog}
        loading={blogsLoading || loading}
      />

      {/* Blog Form Modal */}
      <Modal isOpen={showForm} onClose={handleCloseForm} title={editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}>
        <BlogForm
          blog={editingBlog}
          onSubmit={editingBlog ? handleUpdateBlog : handleAddBlog}
          loading={loading}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
}