import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiPlus, 
  FiCalendar,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiInfo,
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi';
import BackButton from '../../../components/BackButton';

const onboardingStatusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'yellow', icon: <FiClock className="text-yellow-500" /> },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue', icon: <FiRefreshCw className="text-blue-500 animate-spin" /> },
  { value: 'COMPLETED', label: 'Completed', color: 'green', icon: <FiCheckCircle className="text-green-500" /> },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red', icon: <FiXCircle className="text-red-500" /> }
];

const HrOnboarding = () => {
  const [onboardings, setOnboardings] = useState([]);
  const [filteredOnboardings, setFilteredOnboardings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedOnboardings, setExpandedOnboardings] = useState({});
  const [jobOffers, setJobOffers] = useState([]);

  const [form, setForm] = useState({
    jobOfferId: '',
    startDate: '',
    onboardingStatus: 'PENDING',
    documentsSubmitted: '',
    remarks: ''
  });

  const API_BASE = 'http://localhost:8080/api/onboarding';
  const JOB_OFFERS_API = 'http://localhost:8080/api/job-offers/hr';

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchOnboardings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE, getAuthConfig());
      setOnboardings(res.data);
      setFilteredOnboardings(res.data);
    } catch (error) {
      toast.error('Failed to load onboardings');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchJobOffers = async () => {
    try {
      const res = await axios.get(JOB_OFFERS_API, getAuthConfig());
      setJobOffers(res.data);
    } catch (error) {
      toast.error('Failed to load job offers');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOnboardings();
    fetchJobOffers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredOnboardings(onboardings);
    } else {
      const filtered = onboardings.filter(item =>
        item.jobOfferId.toString().includes(searchTerm.trim())
      );
      setFilteredOnboardings(filtered);
    }
  }, [searchTerm, onboardings]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, form, getAuthConfig());
        toast.success('Onboarding updated successfully');
      } else {
        await axios.post(API_BASE, form, getAuthConfig());
        toast.success('Onboarding created successfully');
      }
      resetForm();
      fetchOnboardings();
    } catch (error) {
      toast.error('Error saving onboarding');
      console.error(error);
    }
  };

  const handleEditClick = (onboarding) => {
    setEditingId(onboarding.id);
    setForm({
      jobOfferId: onboarding.jobOfferId,
      startDate: onboarding.startDate ? onboarding.startDate.slice(0, 10) : '',
      onboardingStatus: onboarding.onboardingStatus || 'PENDING',
      documentsSubmitted: onboarding.documentsSubmitted || '',
      remarks: onboarding.remarks || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this onboarding?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, getAuthConfig());
      toast.success('Onboarding deleted successfully');
      fetchOnboardings();
    } catch (error) {
      toast.error('Failed to delete onboarding');
      console.error(error);
    }
  };

  const resetForm = () => {
    setForm({
      jobOfferId: '',
      startDate: '',
      onboardingStatus: 'PENDING',
      documentsSubmitted: '',
      remarks: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const toggleOnboardingExpand = (id) => {
    setExpandedOnboardings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
  };

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
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                    <FiUser className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiFileText className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Onboarding Management
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    Manage and track all employee onboarding processes
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    if (showAddForm) {
                      resetForm();
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold ${
                    showAddForm
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  {showAddForm ? 'Cancel' : 'Add Onboarding'}
                </button>
                <button
                  onClick={fetchOnboardings}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search onboardings by Job Offer ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || searchTerm
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    1
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Status</h3>
                    <select
                      name="status"
                      value={form.onboardingStatus}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      {onboardingStatusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {searchTerm && (
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

          {showAddForm && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {editingId ? 'Edit Onboarding' : 'Create New Onboarding'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Job Offer
                    </label>
                    <select
                      name="jobOfferId"
                      value={form.jobOfferId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    >
                      <option value="">Select a Job Offer</option>
                      {jobOffers.map(offer => (
                        <option key={offer.id} value={offer.id}>
                          {offer.candidateName || `Job Offer #${offer.id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Status
                    </label>
                    <select
                      name="onboardingStatus"
                      value={form.onboardingStatus}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    >
                      {onboardingStatusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full pl-8 border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Documents Submitted
                    </label>
                    <input
                      type="text"
                      name="documentsSubmitted"
                      placeholder="Enter documents submitted"
                      value={form.documentsSubmitted}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>

                  <div className="md:col-span-2 bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      placeholder="Enter any remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 sm:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                  >
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
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
                        Create Onboarding
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {filteredOnboardings.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FiUser className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                No Onboarding Records Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'You currently have no onboarding records. Create a new one to get started.'}
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
                Create New Onboarding
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredOnboardings.map((onboarding) => (
                <div 
                  key={onboarding.id} 
                  className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 overflow-hidden transition-all duration-300 ${
                    expandedOnboardings[onboarding.id] ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div 
                    className={`p-4 sm:p-6 cursor-pointer ${
                      expandedOnboardings[onboarding.id] 
                        ? 'border-b border-gray-200' 
                        : ''
                    }`}
                    onClick={() => toggleOnboardingExpand(onboarding.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                            Onboarding #{onboarding.id}
                          </h3>
                          <span 
                            className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                              onboardingStatusOptions.find(s => s.value === onboarding.onboardingStatus)?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              onboardingStatusOptions.find(s => s.value === onboarding.onboardingStatus)?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              onboardingStatusOptions.find(s => s.value === onboarding.onboardingStatus)?.color === 'green' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            } flex items-center gap-1`}
                          >
                            {onboardingStatusOptions.find(s => s.value === onboarding.onboardingStatus)?.icon}
                            {onboardingStatusOptions.find(s => s.value === onboarding.onboardingStatus)?.label || onboarding.onboardingStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm sm:text-base">
                          <div className="flex items-center text-gray-600">
                            <FiFileText className="mr-2 flex-shrink-0" />
                            <span>Job Offer ID: {onboarding.jobOfferId || 'N/A'}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="mr-2 flex-shrink-0" />
                            <span>Start Date: {onboarding.startDate ? new Date(onboarding.startDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {expandedOnboardings[onboarding.id] ? (
                          <FiChevronUp className="text-gray-400" />
                        ) : (
                          <FiChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedOnboardings[onboarding.id] && (
                    <div className="p-4 sm:p-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                            Documents Submitted
                          </h4>
                          <p className="text-sm sm:text-base">
                            {onboarding.documentsSubmitted || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                            Remarks
                          </h4>
                          <p className="text-sm sm:text-base">
                            {onboarding.remarks || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 sm:gap-3">
                        <button
                          onClick={() => handleEditClick(onboarding)}
                          className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                        >
                          <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(onboarding.id)}
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

export default HrOnboarding;