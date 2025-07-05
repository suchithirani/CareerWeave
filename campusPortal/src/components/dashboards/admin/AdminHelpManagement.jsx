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
  Loader,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../../components/BackButton';

const API = 'http://localhost:8080/api/help-articles';
const token = localStorage.getItem('token');

const AdminHelpManagement = () => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    role: 'STUDENT',
    category: 'GENERAL',
    urgency: 'LOW',
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    category: '',
    urgency: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;

  const roles = ['STUDENT', 'COMPANY_HR'];
  const categories = ['GENERAL', 'PROFILE_ISSUE', 'APPLICATION_ERROR', 'INTERVIEW_PROBLEM', 'OTHER'];
  const urgencies = ['LOW', 'MEDIUM', 'HIGH'];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(res.data);
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? 'put' : 'post';

    try {
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Article ${editId ? 'updated' : 'created'} successfully`);
      setForm({ title: '', content: '', role: 'STUDENT', category: 'GENERAL', urgency: 'LOW' });
      setEditId(null);
      setShowForm(false);
      fetchArticles();
    } catch {
      toast.error('Failed to submit article');
    }
  };

  const handleNewArticle = () => {
    setForm({ title: '', content: '', role: 'STUDENT', category: 'GENERAL', urgency: 'LOW' });
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (article) => {
    setForm({
      title: article.title,
      content: article.content,
      role: article.role,
      category: article.category,
      urgency: article.urgency,
    });
    setEditId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      setDeletingId(id);
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Article deleted');
      fetchArticles();
    } catch {
      toast.error('Failed to delete article');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      role: '',
      category: '',
      urgency: '',
      search: ''
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = filters.search === '' || 
      article.title.toLowerCase().includes(filters.search.toLowerCase()) || 
      article.content.toLowerCase().includes(filters.search.toLowerCase());
    const matchesRole = filters.role === '' || article.role === filters.role;
    const matchesCategory = filters.category === '' || article.category === filters.category;
    const matchesUrgency = filters.urgency === '' || article.urgency === filters.urgency;
    return matchesSearch && matchesRole && matchesCategory && matchesUrgency;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-800';
      case 'COMPANY_HR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'GENERAL': return 'bg-blue-100 text-blue-800';
      case 'PROFILE_ISSUE': return 'bg-purple-100 text-purple-800';
      case 'APPLICATION_ERROR': return 'bg-red-100 text-red-800';
      case 'INTERVIEW_PROBLEM': return 'bg-yellow-100 text-yellow-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="order-1 sm:order-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              <span className="block sm:inline">Help Center</span>{' '}
              <span className="block sm:inline">Management</span>
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-none">
            <BackButton className="flex-1 sm:flex-none justify-center sm:justify-start" />
            <button
              onClick={handleNewArticle}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Article</span>
              <span className="sm:hidden">Article</span>
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
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
                    {editId ? 'Edit Help Article' : 'Create New Article'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        placeholder="Article title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categories.map(cat => (
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
                        {urgencies.map(urg => (
                          <option key={urg} value={urg}>{urg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      placeholder="Detailed article content..."
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
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
                        setEditId(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                    >
                      {editId ? (
                        <>
                          <Save className="w-5 h-5" />
                          Update Article
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Create Article
                        </>
                      )}
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
              placeholder="Search articles..."
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
            
            {(filters.role || filters.category || filters.urgency) && (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role.replace('_', ' ')}</option>
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
                  {categories.map(cat => (
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
                  {urgencies.map(urg => (
                    <option key={urg} value={urg}>{urg}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Articles List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Help Articles
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">
                {filters.search || filters.role || filters.category || filters.urgency 
                  ? "No articles match your filters" 
                  : "No help articles have been created yet"}
              </p>
              <button
                onClick={handleNewArticle}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Article</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedArticles.map((article) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(article.role)}`}>
                          {article.role.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
                          {article.category.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(article.urgency)}`}>
                          {article.urgency}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {article.content}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(article)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                        disabled={deletingId === article.id}
                      >
                        {deletingId === article.id ? (
                          <Loader className="animate-spin h-5 w-5" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </motion.button>
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
                <span className="font-medium">{Math.min(page * itemsPerPage, filteredArticles.length)}</span> of{' '}
                <span className="font-medium">{filteredArticles.length}</span> articles
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

export default AdminHelpManagement;