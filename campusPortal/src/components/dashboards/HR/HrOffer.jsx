import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiPlus, 
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiBriefcase,
  FiInfo
} from 'react-icons/fi';
import BackButton from '../../../components/BackButton';

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'green' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
  { value: 'WITHDRAWN', label: 'Withdrawn', color: 'gray' }
];

const HrOffer = () => {
  const [offers, setOffers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    minSalary: '',
    maxSalary: ''
  });
  const [loading, setLoading] = useState(false);
  const [expandedOffers, setExpandedOffers] = useState({});

  const [form, setForm] = useState({
    jobApplicationId: '',
    salary: '',
    joiningDate: '',
    offerLetterUrl: '',
    status: 'PENDING',
    offerDate: '',
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/job-offers/hr', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setOffers(res.data);
    } catch (error) {
      toast.error('Failed to load job offers');
    }
    setLoading(false);
  };

  const fetchJobApplications = async () => {
    try {
      const res = await api.get('/job-offers/hr/job-application-ids', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setJobApplications(res.data);
    } catch (error) {
      toast.error('Failed to load job applications');
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchJobApplications();
  }, []);

  const handleEditClick = (offer) => {
    setEditingId(offer.id);
    setForm({
      jobApplicationId: offer.jobApplicationId || '',
      salary: offer.salary || '',
      joiningDate: offer.joiningDate ? offer.joiningDate.slice(0, 10) : '',
      offerLetterUrl: offer.offerLetterUrl || '',
      status: offer.status || 'PENDING',
      offerDate: offer.offerDate ? offer.offerDate.slice(0, 10) : '',
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setForm({
      jobApplicationId: '',
      salary: '',
      joiningDate: '',
      offerLetterUrl: '',
      status: 'PENDING',
      offerDate: '',
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (id) => {
    try {
      const updateData = {
        salary: form.salary,
        joiningDate: form.joiningDate,
        offerLetterUrl: form.offerLetterUrl,
        status: form.status,
        offerDate: form.offerDate,
      };
      await api.put(`/job-offers/${id}`, updateData, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      toast.success('Offer updated successfully');
      handleCancel();
      fetchOffers();
    } catch (error) {
      toast.error('Failed to update offer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await api.delete(`/job-offers/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error) {
      toast.error('Failed to delete offer');
    }
  };

  const handleCreate = async () => {
    const { jobApplicationId, salary, joiningDate, offerLetterUrl, status, offerDate } = form;
    if (!jobApplicationId || !salary || !joiningDate || !offerLetterUrl || !status || !offerDate) {
      toast.error('All fields are required');
      return;
    }

    try {
      await api.post('/job-offers', {
        jobApplicationId,
        salary,
        joiningDate,
        offerLetterUrl,
        status,
        offerDate,
      }, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      toast.success('Offer created successfully');
      handleCancel();
      fetchOffers();
    } catch (error) {
      toast.error('Failed to create offer');
    }
  };

  const toggleOfferExpand = (id) => {
    setExpandedOffers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      minSalary: '',
      maxSalary: ''
    });
    setSearchTerm('');
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredOffers = offers.filter(offer => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      offer.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      offer.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.location?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filters.status === '' || offer.status === filters.status;

    // Salary range filter
    const salary = parseFloat(offer.salary) || 0;
    const minSalary = parseFloat(filters.minSalary) || 0;
    const maxSalary = parseFloat(filters.maxSalary) || Infinity;
    const matchesSalary = salary >= minSalary && salary <= maxSalary;

    return matchesSearch && matchesStatus && matchesSalary;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
  <div className="bg-white text-black">
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 sm:p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                  <FiDollarSign className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <FiFileText className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                  Job Offers Management
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg font-medium">
                  Manage and track all job offers
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <BackButton className="text-sm sm:text-base" />
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingId(null);
                  setForm({
                    jobApplicationId: '',
                    salary: '',
                    joiningDate: '',
                    offerLetterUrl: '',
                    status: 'PENDING',
                    offerDate: '',
                  });
                }}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold ${
                  showAddForm
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                {showAddForm ? 'Cancel' : 'Add Offer'}
              </button>
              <button
                onClick={fetchOffers}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search offers by candidate, job title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                showFilters || filters.status || filters.minSalary || filters.maxSalary
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-700 bg-white/70'
              }`}
            >
              <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
              Filters
              {(filters.status || filters.minSalary || filters.maxSalary) && (
                <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  {[filters.status, filters.minSalary, filters.maxSalary].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Status Filter */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Status</h3>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Min Salary Filter */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Min Salary</h3>
                  <input
                    type="number"
                    name="minSalary"
                    placeholder="Minimum"
                    value={filters.minSalary}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                  />
                </div>
                
                {/* Max Salary Filter */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Max Salary</h3>
                  <input
                    type="number"
                    name="maxSalary"
                    placeholder="Maximum"
                    value={filters.maxSalary}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                  />
                </div>
              </div>
              
              {(filters.status || filters.minSalary || filters.maxSalary || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                {editingId ? 'Edit Offer' : 'Create New Offer'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {!editingId && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 sm:p-5">
                  <h4 className="text-sm sm:text-base font-medium text-blue-800 mb-2 sm:mb-3 flex items-center gap-2">
                    <FiInfo className="w-4 h-4" />
                    Candidate Selection
                  </h4>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Select Candidate & Job Application
                    </label>
                    <select
                      name="jobApplicationId"
                      value={form.jobApplicationId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    >
                      <option value="">Select Candidate</option>
                      {jobApplications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.candidateName} - {app.jobTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Salary
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="salary"
                      placeholder="Enter salary amount"
                      value={form.salary}
                      onChange={handleChange}
                      className="w-full pl-8 border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    required
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Offer Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="offerDate"
                      value={form.offerDate}
                      onChange={handleChange}
                      className="w-full pl-8 border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Joining Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="joiningDate"
                      value={form.joiningDate}
                      onChange={handleChange}
                      className="w-full pl-8 border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2 bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Offer Letter URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiFileText className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="offerLetterUrl"
                      placeholder="Enter offer letter URL"
                      value={form.offerLetterUrl}
                      onChange={handleChange}
                      className="w-full pl-8 border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 sm:gap-4 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                  Cancel
                </button>
                <button
                  onClick={editingId ? () => handleSave(editingId) : handleCreate}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  {editingId ? (
                    <>
                      <FiSave className="w-4 h-4 sm:w-5 sm:h-5" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Create Offer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiFileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
              No Job Offers Found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filters.status || filters.minSalary || filters.maxSalary
                ? 'Try adjusting your search or filter criteria'
                : 'You currently have no job offers. Create a new one to get started.'}
            </p>
            <button
              onClick={() => {
                setShowAddForm(true);
                resetFilters();
                setSearchTerm('');
              }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create New Offer
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredOffers.map((offer) => (
              <div 
                key={offer.id} 
                className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 overflow-hidden transition-all duration-300 ${
                  expandedOffers[offer.id] ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div 
                  className={`p-4 sm:p-6 cursor-pointer ${
                    expandedOffers[offer.id] 
                      ? 'border-b border-gray-200' 
                      : ''
                  }`}
                  onClick={() => toggleOfferExpand(offer.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                          {offer.candidateName || 'Unknown Candidate'}
                        </h3>
                        <span 
                          className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                            statusOptions.find(s => s.value === offer.status)?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            statusOptions.find(s => s.value === offer.status)?.color === 'green' ? 'bg-green-100 text-green-800' :
                            statusOptions.find(s => s.value === offer.status)?.color === 'red' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusOptions.find(s => s.value === offer.status)?.label || offer.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm sm:text-base">
                        <div className="flex items-center text-gray-600">
                          <FiBriefcase className="mr-2 flex-shrink-0" />
                          <span className="truncate">{offer.jobTitle || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiDollarSign className="mr-2 flex-shrink-0" />
                          <span>{offer.salary ? `${offer.salary}` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiCalendar className="mr-2 flex-shrink-0" />
                          <span>{offer.offerDate ? new Date(offer.offerDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {expandedOffers[offer.id] ? (
                        <FiChevronUp className="text-gray-400" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedOffers[offer.id] && (
                  <div className="p-4 sm:p-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                          Joining Date
                        </h4>
                        <p className="text-sm sm:text-base">
                          {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                          Location
                        </h4>
                        <p className="text-sm sm:text-base">
                          {offer.location || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                          Offer Letter
                        </h4>
                        {offer.offerLetterUrl ? (
                          <a
                            href={offer.offerLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base flex items-center gap-1"
                          >
                            <FiFileText className="flex-shrink-0" />
                            View Offer Letter
                          </a>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-500">Not available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 sm:gap-3">
                      <button
                        onClick={() => handleEditClick(offer)}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default HrOffer;