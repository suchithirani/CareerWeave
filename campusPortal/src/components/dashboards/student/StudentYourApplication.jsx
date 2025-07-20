import React, { useState, useEffect } from 'react';
import { 
  Briefcase,
  Building,
  Clock,
  Calendar,
  User,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Search,
  Filter,
  X,
  ChevronRight,
  RefreshCw,
  Loader,
  Eye,
  FileText,
  Shield,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import BackButton from '../../BackButton';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StudentYourApplication = () => {
  const [applications, setApplications] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewApplication, setViewApplication] = useState(null);
  const itemsPerPage = 8;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchStudentProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await api.get('/student/profile/me', getAuthConfig());
      setStudentProfile(res.data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      setStudentProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!studentProfile) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/job-applications/me', getAuthConfig());
      if (Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setError("Unexpected response format for applications");
        setApplications([]);
      }
    } catch (error) {
      setError('Failed to fetch your job applications');
      toast.error('Failed to fetch your job applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  useEffect(() => {
    if (studentProfile) {
      fetchApplications();
    }
  }, [studentProfile]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">Applied</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1"><ClockIcon className="w-3 h-3" /> Under Review</span>;
      case 'INTERVIEW_SCHEDULED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1"><Calendar className="w-3 h-3" /> Interview Scheduled</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      case 'SELECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Selected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      searchTerm === '' ||
      (app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filters.status === '' ||
      app.status === filters.status;
    
    const matchesDateFrom = 
      !filters.dateFrom ||
      new Date(app.appliedAt) >= new Date(filters.dateFrom);
    
    const matchesDateTo = 
      !filters.dateTo ||
      new Date(app.appliedAt) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

  if (profileLoading || (studentProfile && loading)) {
    return (
      <div className="bg-white text-black">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 sm:p-6">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <Loader className="animate-spin h-12 w-12 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-black">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 sm:p-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-6 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <AlertCircle className="w-6 h-6 sm:w-10 sm:h-10 text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Error loading applications</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
              {error}
            </p>
            <button
              onClick={fetchApplications}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show profile creation prompt if no profile exists
  if (!studentProfile) {
    return (
      <div className="bg-white text-black">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 sm:p-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-pulse"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 animate-pulse"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                      <Briefcase className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                      Your Applications
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-lg font-medium">
                      Please complete your profile to view applications
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 sm:gap-4">
                  <BackButton className="text-sm sm:text-base" />
                </div>
              </div>
            </div>

            {/* Profile Creation Prompt */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <UserPlus className="w-6 h-6 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Profile Required</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                You need to create your student profile before you can view or submit applications.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/student/profile')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Create Profile
                </button>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
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

        <div className="relative z-10 max-full mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                    <Briefcase className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Your Applications
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchApplications}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          {applications.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                    showFilters || filters.status || filters.dateFrom || filters.dateTo
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-gray-200 text-gray-700 bg-white/70'
                  }`}
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                  {(filters.status || filters.dateFrom || filters.dateTo) && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      {[filters.status, filters.dateFrom, filters.dateTo].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Status</label>
                      <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      >
                        <option value="">All Statuses</option>
                        <option value="APPLIED">Applied</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Applied After</label>
                      <input
                        type="date"
                        name="dateFrom"
                        value={filters.dateFrom}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Applied Before</label>
                      <input
                        type="date"
                        name="dateTo"
                        value={filters.dateTo}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  {(filters.status || filters.dateFrom || filters.dateTo) && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No applications yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                You haven't applied to any job openings yet. Start exploring opportunities now!
              </p>
              <button
                onClick={() => navigate('/student/job-openings')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Browse Job Openings
              </button>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No matching applications</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden">
              <div className="space-y-4 p-4 sm:p-6">
                <AnimatePresence>
                  {currentItems.map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`border rounded-xl p-4 sm:p-6 shadow-sm transition ${
                        app.readStatus ? 'bg-gray-50' : 'bg-white border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{app.jobTitle}</h3>
                                {getStatusBadge(app.status)}
                              </div>
                              <div className="flex items-center text-gray-600 mb-1">
                                <Building className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm sm:text-base">{app.companyName}</span>
                              </div>
                              <div className="flex items-center text-gray-600 mb-1">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm sm:text-base">{app.jobLocation}</span>
                              </div>
                              <div className="flex items-center text-gray-600 mb-3">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm sm:text-base">Applied on {format(new Date(app.appliedAt), 'PPP')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setViewApplication(app)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm sm:text-base"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">View Details</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {filteredApplications.length > itemsPerPage && (
                <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {Math.ceil(filteredApplications.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredApplications.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredApplications.length / itemsPerPage)}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Application Details Modal */}
          <AnimatePresence>
            {viewApplication && (
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
                  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{viewApplication.jobTitle}</h2>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-gray-600">
                            <Building className="w-4 h-4 mr-2" />
                            <span>{viewApplication.companyName}</span>
                          </div>
                          {getStatusBadge(viewApplication.status)}
                        </div>
                      </div>
                      <button
                        onClick={() => setViewApplication(null)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                          Application Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Applied On</h4>
                            <p className="text-gray-800 flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                              {format(new Date(viewApplication.appliedAt), 'PPPpp')}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                            <p className="text-gray-800 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                              {viewApplication.jobLocation}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Resume Submitted</h4>
                            <p className="text-gray-800">
                              {viewApplication.resumeLink ? (
                                <a 
                                  href={viewApplication.resumeLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center"
                                >
                                  View Resume <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                              ) : 'Not available'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                          Application Status
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Current Status</h4>
                            <div className="mt-1">
                              {getStatusBadge(viewApplication.status)}
                            </div>
                          </div>
                          {viewApplication.status === 'INTERVIEW_SCHEDULED' && viewApplication.interviewDate && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Interview Scheduled</h4>
                              <p className="text-gray-800 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                {format(new Date(viewApplication.interviewDate), 'PPPpp')}
                              </p>
                            </div>
                          )}
                          {viewApplication.statusMessage && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                              <p className="text-gray-800 whitespace-pre-line">
                                {viewApplication.statusMessage}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setViewApplication(null)}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentYourApplication;