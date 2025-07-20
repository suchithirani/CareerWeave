import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Search,
  X,
  Eye,
  FileText,
  Calendar,
  Award,
  RefreshCw,
  Loader,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Shield,
  Bookmark,
  CheckCircle,
  ExternalLink,
  Plus,
 
} from 'lucide-react';
import Pagination from '../../Pagination';
import BackButton from '../../BackButton';

const statusColors = {
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-200 text-gray-700',
  FILLED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-gray-300 text-gray-900',
};

const allStatuses = ['ALL', 'OPEN', 'CLOSED', 'EXPIRED', 'FILLED', 'CANCELLED'];

const StudentJobOpening = () => {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [resumeLink, setResumeLink] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState({
    status: 'OPEN',
    location: 'ALL',
    searchText: ''
  });

  const fetchJobOpenings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/job-openings');
      const nonDraftJobs = res.data.filter(job => job.status !== 'DRAFT');
      setAllJobs(nonDraftJobs);
      applyFilters(nonDraftJobs, filters);
    } catch (error) {
      toast.error('Failed to fetch job openings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const res = await api.get('/student/profile/me');
      setStudentProfile(res.data);
      setResumeLink(res.data.resumeLink || '');
    } catch (error) {
      toast.error('Failed to fetch your profile information');
    }
  };

  const applyFilters = (jobs, { status, location, searchText }) => {
    let result = jobs;

    if (status !== 'ALL') {
      result = result.filter((job) => job.status === status);
    }

    if (location !== 'ALL') {
      result = result.filter((job) => job.location === location);
    }

    if (searchText.trim() !== '') {
      result = result.filter((job) =>
        job.title.toLowerCase().includes(searchText.toLowerCase()) ||
        job.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredJobs(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    applyFilters(allJobs, { ...filters, [name]: value });
  };

  const resetFilters = () => {
    const newFilters = {
      status: 'OPEN',
      location: 'ALL',
      searchText: ''
    };
    setFilters(newFilters);
    applyFilters(allJobs, newFilters);
  };

  const fetchJobDetail = async (id) => {
    try {
      const res = await api.get(`/job-openings/${id}`);
      setSelectedJob(res.data);
      await fetchStudentProfile();
    } catch (error) {
      toast.error('Failed to fetch job details');
    }
  };

  const handleApply = async () => {
    if (!resumeLink) {
      toast.error('Please provide a resume link');
      return;
    }

    try {
      setIsApplying(true);
      const studentProfileRes = await api.get('/student/profile/me');
      const studentId = studentProfileRes.data.id;

      const applicationData = {
        studentId: studentId,
        jobOpeningId: selectedJob.id,
        resumeLink: resumeLink
      };

      await api.post('/job-applications', applicationData);
      toast.success('Application submitted successfully!');
      setSelectedJob(null);
      fetchJobOpenings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    fetchJobOpenings();
    fetchStudentProfile();
  }, []);

  const locationOptions = ['ALL', ...Array.from(new Set(allJobs.map((job) => job.location)))];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-blue-200 rounded-full"
        />
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
                  <Plus className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                  Job Openings
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg font-medium">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <BackButton className="text-sm sm:text-base" />
              <button
                onClick={fetchJobOpenings}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              name="searchText"
              placeholder="Search jobs by title, description or location..."
              value={filters.searchText}
              onChange={handleFilterChange}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
              showFilters || filters.status !== 'OPEN' || filters.location !== 'ALL'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-200 text-gray-700 bg-white/70'
            }`}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            Filters
            {(filters.status !== 'OPEN' || filters.location !== 'ALL') && (
              <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                {[filters.status !== 'OPEN' && 'status', filters.location !== 'ALL' && 'location'].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Status Filter */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Status</h3>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                  >
                    {allStatuses.map(status => (
                      <option key={status} value={status}>{status === 'ALL' ? 'All Statuses' : status}</option>
                    ))}
                  </select>
                </div>
                
                {/* Location Filter */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Location</h3>
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                  >
                    {locationOptions.map(loc => (
                      <option key={loc} value={loc}>{loc === 'ALL' ? 'All Locations' : loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(filters.status !== 'OPEN' || filters.location !== 'ALL' || filters.searchText) && (
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

        {/* Jobs List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <Loader className="animate-spin h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Briefcase className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No job openings found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                {filters.status !== 'OPEN' || filters.location !== 'ALL' || filters.searchText
                  ? "Try adjusting your search criteria"
                  : "No job openings are currently available"}
              </p>
              {(filters.status !== 'OPEN' || filters.location !== 'ALL' || filters.searchText) && (
                <button
                  onClick={resetFilters}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      {['Title', 'Company', 'Location', 'Status', 'Salary', 'Deadline', 'Actions'].map((header) => (
                        <th key={header} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {currentItems.map((job) => (
                        <motion.tr
                          key={job.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{job.title}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{job.eligibilityCriteria || 'No criteria specified'}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{job.company?.name || 'Unknown Company'}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{job.location}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                              job.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                              job.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                              job.status === 'FILLED' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                              <span>₹ {job.salaryLPA} LPA</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              <span>
                                {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right space-x-1 sm:space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => fetchJobDetail(job.id)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="View"
                            >
                              <Eye size={16} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3 p-3">
                {currentItems.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => fetchJobDetail(job.id)}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <div className="flex items-center mt-1">
                          <Building className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-600">{job.company?.name || 'Unknown Company'}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {job.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Salary</p>
                          <p className="text-sm flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                            ₹ {job.salaryLPA} LPA
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="text-sm flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {new Date(job.applicationDeadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                              job.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                              job.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                              job.status === 'FILLED' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {job.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredJobs.length > itemsPerPage && (
                <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredJobs.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Job Details Modal */}
        <AnimatePresence>
          {selectedJob && (
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
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedJob.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                          selectedJob.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                          selectedJob.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          selectedJob.status === 'FILLED' ? 'bg-blue-100 text-blue-800' :
                          selectedJob.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedJob.status}
                        </span>
                        <div className="flex items-center text-gray-600">
                          <Building className="w-4 h-4 mr-1" />
                          <span>{selectedJob.company?.name || 'Unknown Company'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedJob(null)}
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
                          <p className="text-gray-800 flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            {selectedJob.location}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Salary</h4>
                          <p className="text-gray-800 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                            ₹ {selectedJob.salaryLPA} LPA
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Application Deadline</h4>
                          <p className="text-gray-800 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            {new Date(selectedJob.applicationDeadline).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-purple-600" />
                        Eligibility Criteria
                      </h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {selectedJob.eligibilityCriteria || 'No specific eligibility criteria provided.'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                      Job Description
                    </h3>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                      {selectedJob.description || 'No detailed description provided.'}
                    </div>
                  </div>

                  {studentProfile && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Your Application
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link *</label>
                          <div className="flex">
                            <input
                              type="text"
                              value={resumeLink}
                              onChange={(e) => setResumeLink(e.target.value)}
                              className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              placeholder="https://drive.google.com/your-resume"
                              required
                            />
                            <a 
                              href={resumeLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r-lg flex items-center"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">{studentProfile.user?.name || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">{studentProfile.degree || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">{studentProfile.branch || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">{studentProfile.cgpa || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
                    </button>
                    {selectedJob.status === 'OPEN' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApply}
                        disabled={isApplying}
                        className={`px-6 py-2 rounded-xl text-white font-medium ${
                          isApplying 
                            ? 'bg-gray-400' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        }`}
                      >
                        {isApplying ? 'Submitting...' : 'Apply Now'}
                      </motion.button>
                    ) : (
                      <div className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl">
                        Applications are not being accepted for this job ({selectedJob.status})
                      </div>
                    )}
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

export default StudentJobOpening;