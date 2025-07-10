import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Briefcase,
  User,
  FileText,
  Filter,
  Search,
  X,
  Eye,
  Download,
  Calendar,
  Clock,
  Award,
  MapPin,
  MessageSquare,
  RefreshCw,
  Loader,
  AlertCircle,
  ChevronRight,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../BackButton';
import Pagination from '../../Pagination';
import api from '../../../services/api';

const OfficerJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'ALL',
    degree: '',
    branch: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewApplication, setViewApplication] = useState(null);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'APPLIED', label: 'Applied' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'OFFERED', label: 'Offered' },
    { value: 'HIRED', label: 'Hired' }
  ];

  const degreeOptions = [
    'Bachelor',
    'Master',
    'PhD'
  ];

  const branchOptions = [
    'Computer Science',
    'Electrical',
    'Mechanical',
    'Civil',
    'Electronics',
    'Information Technology'
  ];

  const statusColors = {
    APPLIED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-purple-100 text-purple-800',
    INTERVIEW_SCHEDULED: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    OFFERED: 'bg-teal-100 text-teal-800',
    HIRED: 'bg-emerald-100 text-emerald-800'
  };

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/job-applications/officer', getAuthConfig());
      if (Array.isArray(response.data)) {
        const processedApplications = response.data.map(app => ({
          ...app,
          studentName: app.studentName || 'Unknown',
          degree: app.degree || 'Not specified',
          branch: app.branch || 'Not specified',
          status: app.status || 'APPLIED'
        }));
        setApplications(processedApplications);
        setFilteredApplications(processedApplications);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching job applications:', error);
      setError('Failed to fetch job applications');
      toast.error('Failed to fetch job applications');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      degree: '',
      branch: ''
    });
    setSearchTerm('');
  };

  const exportToCSV = () => {
    if (filteredApplications.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = [
      'Student Name',
      'Degree',
      'Branch',
      'Status',
      'Applied At',
      'Interview Date',
      'Interviewer',
      'Location',
      'Feedback'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredApplications.map(app => [
        `"${app.studentName}"`,
        `"${app.degree}"`,
        `"${app.branch}"`,
        `"${app.status}"`,
        `"${app.appliedAt ? new Date(app.appliedAt).toLocaleString() : ''}"`,
        `"${app.interviewDateTime ? new Date(app.interviewDateTime).toLocaleString() : ''}"`,
        `"${app.interviewerName || ''}"`,
        `"${app.location || ''}"`,
        `"${app.feedback || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `job-applications-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const filtered = applications.filter(app => {
      const matchesSearch = 
        searchTerm === '' ||
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.branch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filters.status === 'ALL' ||
        app.status === filters.status;
      
      const matchesDegree = 
        filters.degree === '' ||
        app.degree === filters.degree;
      
      const matchesBranch = 
        filters.branch === '' ||
        app.branch === filters.branch;
      
      return matchesSearch && matchesStatus && matchesDegree && matchesBranch;
    });
    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [searchTerm, applications, filters]);

  useEffect(() => {
    fetchApplications();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

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
                    Job Applications
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
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by student name, degree or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                    showFilters || filters.status !== 'ALL' || filters.degree || filters.branch
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-gray-200 text-gray-700 bg-white/70'
                  }`}
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                  {(filters.status !== 'ALL' || filters.degree || filters.branch) && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      {[filters.status !== 'ALL' ? 1 : 0, filters.degree ? 1 : 0, filters.branch ? 1 : 0].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>
                <button
                  onClick={exportToCSV}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Export CSV</span>
                </button>
              </div>
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
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Degree Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Degree</h3>
                    <select
                      name="degree"
                      value={filters.degree}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">All Degrees</option>
                      {degreeOptions.map(degree => (
                        <option key={degree} value={degree}>{degree}</option>
                      ))}
                    </select>
                  </div>

                  {/* Branch Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Branch</h3>
                    <select
                      name="branch"
                      value={filters.branch}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">All Branches</option>
                      {branchOptions.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(filters.status !== 'ALL' || filters.degree || filters.branch || searchTerm) && (
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

          {/* Applications Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader className="animate-spin h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" />
              </div>
            ) : error ? (
              <div className="p-6 sm:p-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Briefcase className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No applications found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {filters.status !== 'ALL' || filters.degree || filters.branch || searchTerm
                    ? "Try adjusting your search criteria"
                    : "No job applications have been submitted yet"}
                </p>
                {(filters.status !== 'ALL' || filters.degree || filters.branch || searchTerm) && (
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentItems.map((app) => (
                          <motion.tr
                            key={app.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{app.studentName}</div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {app.resumeLink ? (
                                  <a 
                                    href={app.resumeLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    View Resume
                                  </a>
                                ) : (
                                  <span className="text-gray-400">No resume</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.degree}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.branch}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                                {app.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : '—'}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex justify-end items-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setViewApplication(app)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1 flex items-center"
                                  title="View Details"
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
                  {currentItems.map((app) => (
                    <motion.div 
                      key={app.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
                    >
                      <div 
                        className="p-4 flex justify-between items-center"
                        onClick={() => setViewApplication(app)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{app.studentName}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Degree</p>
                            <p className="text-sm">
                              {app.degree}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Branch</p>
                            <p className="text-sm">
                              {app.branch}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Applied At</p>
                            <p className="text-sm">
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Resume</p>
                            <p className="text-sm">
                              {app.resumeLink ? (
                                <a 
                                  href={app.resumeLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  View
                                </a>
                              ) : 'None'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredApplications.length > itemsPerPage && (
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredApplications.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* View Application Modal */}
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
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewApplication.studentName}</h2>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[viewApplication.status] || 'bg-gray-100 text-gray-800'}`}>
                            {viewApplication.status.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{viewApplication.appliedAt ? new Date(viewApplication.appliedAt).toLocaleString() : 'No date'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewApplication(null)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Student Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Degree</h4>
                            <p className="text-gray-800">
                              {viewApplication.degree}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Branch</h4>
                            <p className="text-gray-800">
                              {viewApplication.branch}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Resume</h4>
                            <p className="text-gray-800">
                              {viewApplication.resumeLink ? (
                                <a 
                                  href={viewApplication.resumeLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download Resume
                                </a>
                              ) : 'No resume available'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                          Application Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Interview Date</h4>
                            <p className="text-gray-800">
                              {viewApplication.interviewDateTime ? (
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {new Date(viewApplication.interviewDateTime).toLocaleString()}
                                </span>
                              ) : 'Not scheduled'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Interviewer</h4>
                            <p className="text-gray-800">
                              {viewApplication.interviewerName || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                            <p className="text-gray-800">
                              {viewApplication.location ? (
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {viewApplication.location}
                                </span>
                              ) : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                        Feedback
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Status Notes</h4>
                          <p className="text-gray-800">
                            {viewApplication.feedback || 'No feedback provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setViewApplication(null)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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

export default OfficerJobApplications;