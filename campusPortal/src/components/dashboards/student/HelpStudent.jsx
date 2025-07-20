import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  BookOpen,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Search,
  Filter,
  RefreshCw,
  Loader,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../../components/BackButton';

const API_ARTICLES = 'http://localhost:8080/api/help-articles/role/STUDENT';
const API_REQUESTS = 'http://localhost:8080/api/help-requests';
const token = localStorage.getItem('token');

const HelpStudent = () => {
  const [articles, setArticles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    subject: '',
    message: '',
    category: 'GENERAL',
    urgency: 'LOW',
  });
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    urgency: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const urgencyOptions = ['LOW', 'MEDIUM', 'HIGH'];
  const categoryOptions = ['GENERAL', 'PROFILE_ISSUE', 'APPLICATION_ERROR', 'INTERVIEW_PROBLEM', 'OTHER'];
  const statusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  useEffect(() => {
    fetchArticles();
    fetchRequests();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoadingArticles(true);
      const res = await axios.get(API_ARTICLES, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(res.data);
    } catch (err) {
      toast.error('Failed to load help articles');
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await axios.get(`${API_REQUESTS}/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to load help requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_REQUESTS, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Help request submitted successfully');
      setShowRequestForm(false);
      fetchRequests();
      setForm({ subject: '', message: '', category: 'GENERAL', urgency: 'LOW' });
    } catch (err) {
      toast.error('Error submitting help request');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      urgency: ''
    });
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = filters.search === '' || 
      req.subject.toLowerCase().includes(filters.search.toLowerCase()) || 
      req.message.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === '' || req.status === filters.status;
    const matchesCategory = filters.category === '' || req.category === filters.category;
    const matchesUrgency = filters.urgency === '' || req.urgency === filters.urgency;
    return matchesSearch && matchesStatus && matchesCategory && matchesUrgency;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Loader className="w-3 h-3 mr-1 animate-spin" />
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <X className="w-3 h-3 mr-1" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unknown
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'GENERAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            General
          </span>
        );
      case 'PROFILE_ISSUE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            PROFILE ISSUE
          </span>
        );
      case 'APPLICATION_ERROR':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            APPLICATION ERROR
          </span>
        );
      case 'INTERVIEW_PROBLEM':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            INTERVIEW PROBLEM
          </span>
        );
      case 'OTHER':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            OTHER
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            UNKNOWN
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="order-1 sm:order-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              <span className="block sm:inline">Student</span>{' '}
              <span className="block sm:inline">Help Center</span>
            </h1>
            <p className="text-gray-600 mt-1">
              {articles.length} help articles available
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-none">
            <BackButton className="flex-1 sm:flex-none justify-center sm:justify-start" />
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Request</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>
        </div>

        {/* New Request Form */}
        <AnimatePresence>
          {showRequestForm && (
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
                    Submit Help Request
                  </h2>
                  <button
                    onClick={() => {
                      setShowRequestForm(false);
                      setForm({ subject: '', message: '', category: 'GENERAL', urgency: 'LOW' });
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
                      placeholder="Brief description of your issue"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Message</label>
                    <textarea
                      placeholder="Describe your issue in detail..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                      <select
                        value={form.urgency}
                        onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {urgencyOptions.map(urg => (
                          <option key={urg} value={urg}>{urg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRequestForm(false);
                        setForm({ subject: '', message: '', category: 'GENERAL', urgency: 'LOW' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Articles */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Help Articles
            </h2>
            <button
              onClick={fetchArticles}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          {loadingArticles ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No help articles available for students</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((article) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.content}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadge(article.category).props.className}`}>
                        {article.category.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadge(article.urgency).props.className}`}>
                        {article.urgency}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* My Requests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              My Help Requests
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRequests}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search requests..."
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
              
              {(filters.search || filters.status || filters.category || filters.urgency) && (
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
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    name="urgency"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={filters.urgency}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Urgencies</option>
                    {urgencyOptions.map(urg => (
                      <option key={urg} value={urg}>{urg}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {loadingRequests ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <Mail className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">
                {filters.search || filters.status || filters.category || filters.urgency 
                  ? "No requests match your filters" 
                  : "You haven't submitted any help requests yet"}
              </p>
              <button
                onClick={() => setShowRequestForm(true)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Submit Your First Request</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedRequests.map((request) => (
                <motion.div 
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{request.subject}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.urgency)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(request.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                      {request.message}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {getCategoryBadge(request.category)}
                      {request.response && (
                        <div className="w-full mt-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-1">
                            <MessageSquare className="w-4 h-4" />
                            Admin Response
                          </div>
                          <p className="text-sm text-blue-700 whitespace-pre-wrap">{request.response}</p>
                        </div>
                      )}
                    </div>
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
                <span className="font-medium">{Math.min(page * itemsPerPage, filteredRequests.length)}</span> of{' '}
                <span className="font-medium">{filteredRequests.length}</span> requests
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

export default HelpStudent;