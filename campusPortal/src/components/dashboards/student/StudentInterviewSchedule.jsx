import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  User,
  Briefcase,
  MapPin,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Search,
  Filter,
  X,
  ChevronRight,
  RefreshCw,
  Loader,
  Eye
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { Tooltip, Tag } from 'antd';
import BackButton from '../../BackButton';

const StudentInterviewSchedule = () => {
  const [schedules, setSchedules] = useState([]);
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
  const [viewSchedule, setViewSchedule] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchInterviewSchedules = async () => {
      try {
        const response = await api.get('/interview-schedules/student');
        setSchedules(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching interview schedules:', err);
      }
    };

    fetchInterviewSchedules();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/interview-schedules/student');
      setSchedules(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1"><ClockIcon className="w-3 h-3" /> Scheduled</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
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

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      searchTerm === '' ||
      (schedule.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.candidateName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.interviewerName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filters.status === '' ||
      schedule.status === filters.status;
    
    const matchesDateFrom = 
      !filters.dateFrom ||
      new Date(schedule.interviewDateTime) >= new Date(filters.dateFrom);
    
    const matchesDateTo = 
      !filters.dateTo ||
      new Date(schedule.interviewDateTime) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchedules.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm text-red-700">Failed to load interview schedules: {error}</p>
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
                    <Calendar className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    My Interview Schedules
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {filteredSchedules.length} {filteredSchedules.length === 1 ? 'schedule' : 'schedules'} found
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={refreshData}
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
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by job title, candidate or interviewer..."
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
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {/* Date From Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">From Date</h3>
                    <input
                      type="date"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>

                  {/* Date To Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">To Date</h3>
                    <input
                      type="date"
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                {(filters.status || filters.dateFrom || filters.dateTo || searchTerm) && (
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

          {/* Schedules Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden">
            {filteredSchedules.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Calendar className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No schedules found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {filters.status || filters.dateFrom || filters.dateTo || searchTerm
                    ? "Try adjusting your search criteria"
                    : "You don't have any interview schedules yet"}
                </p>
                {(filters.status || filters.dateFrom || filters.dateTo || searchTerm) && (
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentItems.map((schedule) => (
                          <motion.tr
                            key={schedule.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{schedule.jobTitle}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{schedule.candidateName}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {schedule.interviewerName}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(schedule.interviewDateTime).toLocaleString()}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {schedule.location || <span className="text-gray-400">Not provided</span>}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(schedule.status)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {schedule.feedback ? (
                                <Tooltip title={schedule.feedback}>
                                  <span className="line-clamp-1">{schedule.feedback}</span>
                                </Tooltip>
                              ) : (
                                <span className="text-gray-400">Pending</span>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex justify-start items-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setViewSchedule(schedule)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1 flex items-center"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3 p-3">
                  {currentItems.map((schedule) => (
                    <div key={schedule.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                      <div 
                        className="p-4 flex justify-between items-center"
                        onClick={() => setViewSchedule(schedule)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{schedule.jobTitle}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600">{schedule.candidateName}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Interviewer</p>
                            <p className="text-sm">
                              {schedule.interviewerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date & Time</p>
                            <p className="text-sm">
                              {new Date(schedule.interviewDateTime).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm">
                              {schedule.location || <span className="text-gray-400">Not provided</span>}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm">
                              {getStatusBadge(schedule.status)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Feedback</p>
                          <p className="text-sm">
                            {schedule.feedback ? (
                              <Tooltip title={schedule.feedback}>
                                <span className="line-clamp-2">{schedule.feedback}</span>
                              </Tooltip>
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredSchedules.length > itemsPerPage && (
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {Math.ceil(filteredSchedules.length / itemsPerPage)}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredSchedules.length / itemsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredSchedules.length / itemsPerPage)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* View Schedule Modal */}
          <AnimatePresence>
            {viewSchedule && (
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewSchedule.jobTitle}</h2>
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {viewSchedule.candidateName}
                          </span>
                          {getStatusBadge(viewSchedule.status)}
                        </div>
                      </div>
                      <button
                        onClick={() => setViewSchedule(null)}
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
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Job Title</h4>
                            <p className="text-gray-800">
                              {viewSchedule.jobTitle}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Candidate</h4>
                            <p className="text-gray-800">
                              {viewSchedule.candidateName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                          Interview Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                            <p className="text-gray-800">
                              {new Date(viewSchedule.interviewDateTime).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Interviewer</h4>
                            <p className="text-gray-800">
                              {viewSchedule.interviewerName}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                            <p className="text-gray-800">
                              {viewSchedule.location || <span className="text-gray-500">Not specified</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Feedback
                      </h3>
                      <div className="space-y-4">
                        <div>
                          {viewSchedule.feedback ? (
                            <p className="text-gray-800 whitespace-pre-line">
                              {viewSchedule.feedback}
                            </p>
                          ) : (
                            <p className="text-gray-500 italic">
                              No feedback provided yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setViewSchedule(null)}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
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

export default StudentInterviewSchedule;