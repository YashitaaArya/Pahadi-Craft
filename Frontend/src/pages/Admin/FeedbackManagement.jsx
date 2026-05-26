import React, { useState, useMemo } from 'react';
import { Search, Star, Trash2 } from 'lucide-react';
import FeedbackTable from '../../components/Admin/FeedbackTable';
import FeedbackDetail from '../../components/Admin/FeedbackDetail';
import Modal from '../../components/Admin/Modal';
import { useFirestore } from '../../hooks/useFirestore';
import { deleteFeedback } from '../../services/feedbackService';

export default function FeedbackManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { documents: feedbacks, loading: feedbacksLoading } = useFirestore('feedback');

  const filteredFeedbacks = useMemo(() => {
    return feedbacks?.filter((feedback) => {
      const matchesSearch =
        feedback.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.message?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating = filterRating === 'all' || feedback.rating?.toString() === filterRating;

      return matchesSearch && matchesRating;
    }) || [];
  }, [feedbacks, searchTerm, filterRating]);

  const feedbackStats = useMemo(() => {
    return {
      total: feedbacks?.length || 0,
      avgRating: feedbacks?.length > 0
        ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
        : 0,
      fiveStars: feedbacks?.filter((f) => f.rating === 5).length || 0,
      oneStars: feedbacks?.filter((f) => f.rating === 1).length || 0,
    };
  }, [feedbacks]);

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setLoading(true);
      try {
        await deleteFeedback(feedbackId);
        setMessage('Feedback deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting feedback: ' + error.message);
      }
      setLoading(false);
    }
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetail(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback & Reviews</h1>
        <p className="text-gray-600">Manage customer feedback and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-gray-900">{feedbackStats.total}</p>
          <p className="text-sm text-gray-600">Total Feedback</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <p className="text-2xl font-bold text-gray-900">{feedbackStats.avgRating}</p>
          </div>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-green-600">{feedbackStats.fiveStars}</p>
          <p className="text-sm text-gray-600">5-Star Reviews</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-red-600">{feedbackStats.oneStars}</p>
          <p className="text-sm text-gray-600">1-Star Reviews</p>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{message}</p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        {/* Rating Filter */}
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Feedback Table */}
      <FeedbackTable
        feedbacks={filteredFeedbacks}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteFeedback}
        loading={feedbacksLoading || loading}
      />

      {/* Feedback Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Feedback Details">
        {selectedFeedback && <FeedbackDetail feedback={selectedFeedback} />}
      </Modal>
    </div>
  );
}