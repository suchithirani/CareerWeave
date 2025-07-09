import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  BookOpen,
  FileText,
  Clock,
  HelpCircle,
  Mail,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Search,
  Filter,
  RefreshCw,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../../components/BackButton';

const API_ARTICLES = 'http://localhost:8080/api/help-articles/role/COMPANY_HR';
const API_REQUESTS = 'http://localhost:8080/api/help-requests';
const token = localStorage.getItem('token');

const HrHelp = () => {
  const [articles, setArticles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    subject: '',
    message: '',
    category: 'GENERAL',
    urgency: 'LOW',
  });
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState({
    articles: true,
    requests: true
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    urgency: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const urgencyOptions = ['LOW', 'MEDIUM', 'HIGH'];
  const categoryOptions = ['GENERAL', 'PROFILE_ISSUE', 'APPLICATION_ERROR', 'INTERVIEW_PROBLEM', 'OTHER'];

  useEffect(() => {
    fetchArticles();
    fetchRequests();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(API_ARTICLES, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(res.data);
      setLoading(prev => ({ ...prev, articles: false }));
    } catch (err) {
      toast.error('Failed to load help articles.');
      setLoading(prev => ({ ...prev, articles: false }));
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_REQUESTS}/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
      setLoading(prev => ({ ...prev, requests: false }));
    } catch (err) {
      toast.error('Failed to load your help requests.');
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_REQUESTS, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Help request submitted successfully');
      setForm({ subject: '', message: '', category: 'GENERAL', urgency: 'LOW' });
      setShowCreateModal(false);
      fetchRequests();
    } catch (err) {
      toast.error('Error submitting help request');
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = filters.search === '' || 
      article.title.toLowerCase().includes(filters.search.toLowerCase()) || 
      article.content.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === '' || article.category === filters.category;
    const matchesUrgency = filters.urgency === '' || article.urgency === filters.urgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = filters.search === '' || 
      request.subject.toLowerCase().includes(filters.search.toLowerCase()) || 
      request.message.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === '' || request.category === filters.category;
    const matchesUrgency = filters.urgency === '' || request.urgency === filters.urgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      urgency: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
  <div className="order-1 sm:order-none">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
      <span className="block sm:inline">HR</span>{' '}
      <span className="block sm:inline">Help</span>{' '}
      <span className="block sm:inline">Center</span>
    </h1>
    <p className="text-gray-600 mt-1">Find answers or submit a help request</p>
  </div>
  
  <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-none">
    <BackButton className="flex-1 sm:flex-none justify-center sm:justify-start" />
    <button
      onClick={() => setShowCreateModal(true)}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
    >
      <Plus className="w-5 h-5" />
      <span className="hidden sm:inline">New Request</span>
      <span className="sm:hidden">Request</span>
    </button>
  </div>
</div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles or requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
            
            {(filters.category || filters.urgency) && (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                >
                  <option value="">All Urgency Levels</option>
                  {urgencyOptions.map((urg) => (
                    <option key={urg} value={urg}>{urg}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Help Articles Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Help Articles
            </h2>
          </div>

          {loading.articles ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No articles found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          article.category === 'GENERAL' ? 'bg-blue-100 text-blue-800' :
                          article.category === 'PROFILE_ISSUE' ? 'bg-purple-100 text-purple-800' :
                          article.category === 'APPLICATION_ERROR' ? 'bg-red-100 text-red-800' :
                          article.category === 'INTERVIEW_PROBLEM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.category.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          article.urgency === 'LOW' ? 'bg-green-100 text-green-800' :
                          article.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {article.urgency}
                        </span>
                      </div>
                    </div>
                    {expandedArticle === article.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedArticle === article.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4"
                      >
                        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                          {article.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* My Requests Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              My Help Requests
            </h2>
          </div>

          {loading.requests ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">You haven't submitted any help requests yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Request</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <motion.div 
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{request.subject}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          request.category === 'GENERAL' ? 'bg-blue-100 text-blue-800' :
                          request.category === 'PROFILE_ISSUE' ? 'bg-purple-100 text-purple-800' :
                          request.category === 'APPLICATION_ERROR' ? 'bg-red-100 text-red-800' :
                          request.category === 'INTERVIEW_PROBLEM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.category.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          request.urgency === 'LOW' ? 'bg-green-100 text-green-800' :
                          request.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.urgency}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          request.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                          request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    {expandedRequest === request.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedRequest === request.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4"
                      >
                        <div className="prose max-w-none text-gray-700 whitespace-pre-line mb-3">
                          {request.message}
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted on: {new Date(request.createdAt).toLocaleString()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Create Request Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-lg w-full max-w-md"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">New Help Request</h3>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                          type="text"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          >
                            {categoryOptions.map((cat) => (
                              <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                          <select
                            value={form.urgency}
                            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          >
                            {urgencyOptions.map((urg) => (
                              <option key={urg} value={urg}>{urg}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HrHelp;