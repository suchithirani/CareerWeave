import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { 
  Briefcase, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Edit2, 
  Trash2, 
  Eye, 
  Filter, 
  Loader,
  Search,
  ArrowLeft,
  BookOpen,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../../components/BackButton';

const statusOptions = [
  { value: 'OPEN', label: 'Open', color: 'green' },
  { value: 'CLOSED', label: 'Closed', color: 'red' },
  { value: 'DRAFT', label: 'Draft', color: 'yellow' },
  { value: 'FILLED', label: 'Filled', color: 'blue' },
  { value: 'EXPIRED', label: 'Expired', color: 'gray' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'purple' }
];

const AdminJobOpenings = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewJob, setViewJob] = useState(null);
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salaryLPA: '',
    applicationDeadline: '',
    eligibilityCriteria: '',
    companyId: '',
    status: 'OPEN'
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, companiesRes] = await Promise.all([
          api.get('/job-openings', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/company', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setJobOpenings(jobsRes.data);
        setFilteredJobs(jobsRes.data);
        setCompanies(companiesRes.data);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, token]);

  useEffect(() => {
    let results = jobOpenings;
    
    if (filters.status) {
      results = results.filter(job => job.status === filters.status);
    }
    
    if (filters.company) {
      results = results.filter(job => job.company?.id === filters.company);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm) || 
        job.description.toLowerCase().includes(searchTerm))
    }
    
    setFilteredJobs(results);
    setPage(1);
  }, [filters, jobOpenings]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job opening?')) return;
    
    try {
      setDeletingId(id);
      await api.delete(`/job-openings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Job opening deleted successfully');
      setRefresh(!refresh);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Cannot delete job opening with existing applications');
      } else {
        toast.error('Failed to delete job opening');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingStatus(id);
      await api.put(`/job-openings/${id}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Status updated to ${status}`);
      setRefresh(!refresh);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openEditModal = (job) => {
    setEditJob(job);
    setForm({ 
      title: job.title,
      description: job.description,
      location: job.location,
      salaryLPA: job.salaryLPA,
      applicationDeadline: job.applicationDeadline.split('T')[0],
      eligibilityCriteria: job.eligibilityCriteria,
      companyId: job.company?.id || '',
      status: job.status || 'OPEN'
    });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      company: '',
      search: ''
    });
  };

  const handleEditSubmit = async () => {
    if (!form.title || !form.location || !form.applicationDeadline || !form.companyId) {
      return toast.error("Title, location, company, and deadline are required.");
    }
    try {
      await api.put(`/job-openings/${editJob.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Job updated successfully');
      setEditJob(null);
      setRefresh(!refresh);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    }
  };

  const handleCreateSubmit = async () => {
    if (!form.title || !form.location || !form.applicationDeadline || !form.companyId) {
      return toast.error("Title, location, company, and deadline are required.");
    }
    try {
      await api.post('/job-openings', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Job created successfully');
      setShowCreateModal(false);
      setForm({
        title: '',
        description: '',
        location: '',
        salaryLPA: '',
        applicationDeadline: '',
        eligibilityCriteria: '',
        companyId: '',
        status: 'OPEN'
      });
      setRefresh(!refresh);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    }
  };

  const renderStatusDropdown = (job) => (
    <select
      value={job.status}
      onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
      className={`text-xs rounded-full px-2 py-1 focus:outline-none focus:ring-1 ${
        job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
        job.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
        job.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
        job.status === 'FILLED' ? 'bg-blue-100 text-blue-800' :
        job.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
        'bg-purple-100 text-purple-800'
      }`}
      disabled={updatingStatus === job.id}
    >
      {statusOptions.map(option => (
        <option 
          key={option.value} 
          value={option.value}
          className={`bg-${option.color}-100 text-${option.color}-800`}
        >
          {updatingStatus === job.id ? 'Updating...' : option.label}
        </option>
      ))}
    </select>
  );

  const renderFormModal = ({ isEdit = false }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{isEdit ? 'Edit' : 'Create'} Job Opening</h3>
          <button 
            onClick={() => isEdit ? setEditJob(null) : setShowCreateModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input 
              type="text" 
              name="title" 
              value={form.title} 
              onChange={handleFormChange} 
              placeholder="Job Title" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Company *</label>
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Location *</label>
            <input 
              type="text" 
              name="location" 
              value={form.location} 
              onChange={handleFormChange} 
              placeholder="e.g. Remote, New York, etc." 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Salary (LPA)</label>
            <input 
              type="number" 
              name="salaryLPA" 
              value={form.salaryLPA} 
              onChange={handleFormChange} 
              placeholder="e.g. 12" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Deadline *</label>
            <input 
              type="date" 
              name="applicationDeadline" 
              value={form.applicationDeadline} 
              onChange={handleFormChange} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Eligibility Criteria</label>
            <input 
              type="text" 
              name="eligibilityCriteria" 
              value={form.eligibilityCriteria} 
              onChange={handleFormChange} 
              placeholder="e.g. Bachelor's degree required" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
            />
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleFormChange} 
              placeholder="Detailed job description..." 
              rows={4} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => isEdit ? setEditJob(null) : setShowCreateModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={isEdit ? handleEditSubmit : handleCreateSubmit}
            disabled={!form.title || !form.location || !form.applicationDeadline || !form.companyId}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              (!form.title || !form.location || !form.applicationDeadline || !form.companyId) 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isEdit ? 'Update Job' : 'Create Job'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-white text-black">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 animate-pulse"></div>
        </div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
  <div className="flex items-center">
    <div className="relative">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-2xl">
        <Briefcase className="w-8 h-8 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <Plus className="w-3 h-3 text-white animate-pulse" />
      </div>
    </div>
    <div>
      <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
        Job Openings
      </h1>
      <p className="text-gray-600 text-lg font-medium">
        {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
      </p>
    </div>
  </div>
  <div className="flex items-center space-x-4">
    <BackButton />
    <button 
      onClick={() => setShowCreateModal(true)}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
    >
      <Plus className="w-5 h-5" />
      <span>Create New Job</span>
    </button>
  </div>
</div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search jobs by title or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium ${
                showFilters || filters.status || filters.company
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-700 bg-white/70'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {(filters.status || filters.company) && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {[filters.status, filters.company].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">All Statuses</option>
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Company Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Company</h3>
                    <select
                      name="company"
                      value={filters.company}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">All Companies</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(filters.status || filters.company) && (
                  <button
                    onClick={resetFilters}
                    className="mt-6 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Jobs Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin h-12 w-12 text-indigo-600" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No job openings found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {filters.search || filters.status || filters.company 
                    ? "Try adjusting your search criteria" 
                    : "No job openings have been created yet"}
                </p>
                
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        {['Title', 'Company', 'Location', 'Status', 'Salary', 'Deadline', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {paginatedJobs.map((job) => (
                          <motion.tr
                            key={job.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{job.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">{job.company?.name || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">{job.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderStatusDropdown(job)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">{job.salaryLPA ? `${job.salaryLPA} LPA` : '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">
                                {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setViewJob(job)}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="View"
                              >
                                <Eye size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditModal(job)}
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(job.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                                disabled={deletingId === job.id}
                              >
                                {deletingId === job.id ? (
                                  <Loader className="animate-spin h-4 w-4" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-700 mb-4 md:mb-0">
                      Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(page * itemsPerPage, filteredJobs.length)}</span> of{' '}
                      <span className="font-medium">{filteredJobs.length}</span> jobs
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          

          {/* Modals */}
          <AnimatePresence>
            {editJob && renderFormModal({ isEdit: true })}
            {showCreateModal && renderFormModal({ isEdit: false })}
          </AnimatePresence>

          {/* View Job Modal */}
          <AnimatePresence>
            {viewJob && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewJob.title}</h2>
                        <div className="flex items-center space-x-4">
                          <p className="text-indigo-600 font-medium">{viewJob.company?.name || 'N/A'}</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            viewJob.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                            viewJob.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                            viewJob.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                            viewJob.status === 'FILLED' ? 'bg-blue-100 text-blue-800' :
                            viewJob.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {statusOptions.find(s => s.value === viewJob.status)?.label || viewJob.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewJob(null)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                          Job Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                            <p className="text-gray-800">{viewJob.location}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Salary</h4>
                            <p className="text-gray-800">{viewJob.salaryLPA ? `${viewJob.salaryLPA} LPA` : 'Not specified'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                          Application Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Deadline</h4>
                            <p className="text-gray-800">
                              {new Date(viewJob.applicationDeadline).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Eligibility</h4>
                            <p className="text-gray-800">{viewJob.eligibilityCriteria || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                        Job Description
                      </h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {viewJob.description || 'No description provided.'}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setViewJob(null)}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminJobOpenings;