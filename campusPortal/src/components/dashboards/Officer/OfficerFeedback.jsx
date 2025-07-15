import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  MessageSquare,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Search,
  Filter,
  RefreshCw,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../../components/BackButton';

const API_BASE = 'http://localhost:8080/api/feedback';
const token = localStorage.getItem('token');

const OfficerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '' // responded or pending
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(res.data);
    } catch {
      toast.error('Failed to load your feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Feedback submitted successfully');
      setForm({ subject: '', message: '' });
      setShowForm(false);
      fetchMyFeedback();
    } catch {
      toast.error('Failed to submit feedback');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: ''
    });
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch = filters.search === '' || 
      fb.subject.toLowerCase().includes(filters.search.toLowerCase()) || 
      fb.message.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === '' || 
      (filters.status === 'responded' && fb.response) ||
      (filters.status === 'pending' && !fb.response);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusBadge = (hasResponse) => {
    if (hasResponse) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Responded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="order-1 sm:order-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              <span className="block sm:inline">Placement Officer</span>{' '}
              <span className="block sm:inline">Feedback</span>
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? 'feedback' : 'feedbacks'} found
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-none">
            <BackButton className="flex-1 sm:flex-none justify-center sm:justify-start" />
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Feedback</span>
              <span className="sm:hidden">Feedback</span>
            </button>
          </div>
        </div>

        {/* New Feedback Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Submit Feedback
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setForm({ subject: '', message: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief description of your feedback"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Feedback</label>
                    <textarea
                      placeholder="Describe your feedback in detail..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setForm({ subject: '', message: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search feedback..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {(filters.search || filters.status) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <RefreshCw className="w-4 h-4" />
                Reset filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="responded">Responded</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Feedback List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Your Submitted Feedback
            </h2>
            <button
              onClick={fetchMyFeedback}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">
                {filters.search || filters.status 
                  ? "No feedback matches your filters" 
                  : "You haven't submitted any feedback yet"}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Submit Your First Feedback</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedFeedbacks.map((fb) => (
                <motion.div 
                  key={fb.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{fb.subject}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(fb.response)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(fb.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-4 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                      {fb.message}
                    </div>
                    
                    {fb.response && (
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-1">
                          <MessageSquare className="w-4 h-4" />
                          Admin Response
                        </div>
                        <p className="text-sm text-blue-700 whitespace-pre-wrap">{fb.response}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * itemsPerPage, filteredFeedbacks.length)}</span> of{' '}
                <span className="font-medium">{filteredFeedbacks.length}</span> feedbacks
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OfficerFeedback;