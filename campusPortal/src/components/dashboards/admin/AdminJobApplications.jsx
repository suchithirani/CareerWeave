import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Eye, 
  Edit2, 
  Trash2, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X,
  Filter,
  RefreshCw,
  FileText,
  Calendar,
  User,
  Briefcase,
  Building,
  Award,
  Clock,
  Search
} from 'lucide-react';
import BackButton from '../../../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';

const AdminJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [jobsMap, setJobsMap] = useState({});
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewApp, setViewApp] = useState(null);
  const [editApp, setEditApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    interviewDateTime: '',
    interviewerName: '',
    location: '',
    feedback: '',
    notes: '',
    offerDetails: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: '',
    jobType: ''
  });

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const statusOptions = [
    'APPLIED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 
    'REJECTED', 'OFFERED', 'HIRED'
  ];

  const statusColors = {
    APPLIED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-purple-100 text-purple-800',
    INTERVIEW_SCHEDULED: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-800',
    OFFERED: 'bg-green-100 text-green-800',
    HIRED: 'bg-emerald-100 text-emerald-800',
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [appRes, studentRes, jobRes] = await Promise.all([
        api.get('/job-applications'),
        api.get('/auth/users?role=STUDENT'),
        api.get('/job-openings'),
      ]);

      const studentsById = {};
      studentRes.data.forEach((s) => (studentsById[s.id] = s));
      setStudentsMap(studentsById);

      const jobsById = {};
      jobRes.data.forEach((j) => (jobsById[j.id] = j));
      setJobsMap(jobsById);

      setApplications(appRes.data);
      setFiltered(appRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    filterApplications(keyword, activeFilters);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...activeFilters,
      [filterName]: value === activeFilters[filterName] ? '' : value
    };
    setActiveFilters(newFilters);
    filterApplications(search, newFilters);
  };

  const filterApplications = (searchTerm, filters) => {
    const filteredData = applications.filter((app) => {
      const student = studentsMap[app.studentId];
      const job = jobsMap[app.jobOpeningId];
      
      // Search filter
      const matchesSearch = 
        !searchTerm ||
        student?.name?.toLowerCase().includes(searchTerm) ||
        job?.title?.toLowerCase().includes(searchTerm) ||
        app.status?.toLowerCase().includes(searchTerm) ||
        app.id?.toString().includes(searchTerm);
      
      // Status filter
      const matchesStatus = 
        !filters.status || 
        app.status === filters.status;
      
      // Job type filter
      const matchesJobType = 
        !filters.jobType ||
        (job?.jobType && job.jobType === filters.jobType);
      
      return matchesSearch && matchesStatus && matchesJobType;
    });
    
    setFiltered(filteredData);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveFilters({
      status: '',
      jobType: ''
    });
    setFiltered(applications);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await api.delete(`/job-applications/${id}`);
      toast.success('Deleted successfully');
      setApplications((prev) => prev.filter((app) => app.id !== id));
      setFiltered((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      toast.error('Failed to delete');
      console.error(err);
    }
  };

  const fetchApplicationDetails = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/job-applications/${id}`);
      return res.data;
    } catch (err) {
      toast.error('Failed to load application details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (app) => {
    const details = await fetchApplicationDetails(app.id);
    if (details) {
      setViewApp(details);
    }
  };

  const closeViewModal = () => setViewApp(null);

  const openEditModal = async (app) => {
    const details = await fetchApplicationDetails(app.id);
    if (details) {
      setEditApp(details);
      setEditForm({
        status: details.status || '',
        interviewDateTime: details.interviewDateTime ? details.interviewDateTime.slice(0, 16) : '',
        interviewerName: details.interviewerName || '',
        location: details.location || '',
        feedback: details.feedback || '',
        notes: details.notes || '',
        offerDetails: details.offerDetails || '',
      });
    }
  };

  const closeEditModal = () => setEditApp(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/job-applications/${editApp.id}`, editForm);
      toast.success('Updated successfully');
      setApplications((prev) =>
        prev.map((app) =>
          app.id === editApp.id ? { ...app, ...editForm } : app
        )
      );
      setFiltered((prev) =>
        prev.map((app) =>
          app.id === editApp.id ? { ...app, ...editForm } : app
        )
      );
      closeEditModal();
    } catch (err) {
      toast.error('Failed to update');
      console.error(err);
    }
  };

  const downloadResume = (url, studentName) => {
    if (!url) {
      toast.error('No resume available for download');
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_${studentName || 'candidate'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                    <Award className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                    Job Applications
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    {filtered.length} {filtered.length === 1 ? 'application' : 'applications'} found
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Last updated: {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <BackButton />
                <button 
                  onClick={fetchAllData}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications by student, job title, status or ID..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium ${
                  showFilters || activeFilters.status || activeFilters.jobType
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {(activeFilters.status || activeFilters.jobType) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {[activeFilters.status, activeFilters.jobType].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
                    <div className="space-y-2">
                      {statusOptions.map(status => (
                        <button
                          key={status}
                          onClick={() => handleFilterChange('status', status)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                            activeFilters.status === status
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {status.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Job Type</h3>
                    <div className="space-y-2">
                      {['FULLTIME', 'INTERNSHIP', 'PARTTIME'].map(type => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange('jobType', type)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                            activeFilters.jobType === type
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {(activeFilters.status || activeFilters.jobType) && (
                  <button
                    onClick={clearFilters}
                    className="mt-6 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Applications Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="animate-spin h-12 w-12 text-indigo-600" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {search || activeFilters.status || activeFilters.jobType 
                    ? "Try adjusting your search criteria" 
                    : "No job applications have been submitted yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentItems.map((app) => {
                          const student = studentsMap[app.studentId];
                          const job = jobsMap[app.jobOpeningId];
                          return (
                            <motion.tr
                              key={app.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{app.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                                    {student?.name ? (
                                      <span className="text-blue-600 font-medium">
                                        {student.name.charAt(0).toUpperCase()}
                                      </span>
                                    ) : (
                                      <User className="w-5 h-5 text-blue-600" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{student?.name || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{student?.email || ''}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{job?.title || 'N/A'}</div>
                                <div className="text-xs text-gray-500">{job?.company?.name || ''}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                                  {app.status.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => downloadResume(app.resumeLink, student?.name)}
                                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                  disabled={!app.resumeLink}
                                >
                                  <Download className="w-4 h-4" />
                                  {app.resumeLink ? 'Download' : 'N/A'}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.appliedAt ? format(new Date(app.appliedAt), 'MMM dd, yyyy') : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => openViewModal(app)}
                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => openEditModal(app)}
                                    className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(app.id)}
                                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-700 mb-4 md:mb-0">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> of{' '}
                      <span className="font-medium">{filtered.length}</span> applications
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
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
        </div>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Details</h2>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[viewApp.status] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {viewApp.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-gray-600">ID: {viewApp.id}</span>
                    </div>
                  </div>
                  <button
                    onClick={closeViewModal}
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
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                        <p className="text-gray-800">
                          {studentsMap[viewApp.studentId]?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                        <p className="text-gray-800">
                          {studentsMap[viewApp.studentId]?.email || '-'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Resume</h4>
                        <button
                          onClick={() => downloadResume(viewApp.resumeLink, studentsMap[viewApp.studentId]?.name)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          disabled={!viewApp.resumeLink}
                        >
                          <Download className="w-4 h-4" />
                          {viewApp.resumeLink ? 'Download Resume' : 'No resume available'}
                        </button>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h4>
                        <p className="text-gray-800">
                          {viewApp.coverLetter || 'No cover letter provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                      Job Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Job Title</h4>
                        <p className="text-gray-800">
                          {jobsMap[viewApp.jobOpeningId]?.title || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
                        <p className="text-gray-800">
                          {jobsMap[viewApp.jobOpeningId]?.company?.name || '-'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Applied On</h4>
                        <p className="text-gray-800">
                          {viewApp.appliedAt ? format(new Date(viewApp.appliedAt), 'MMM dd, yyyy HH:mm') : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                    Interview & Offer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Interview Date & Time</h4>
                      <p className="text-gray-800">
                        {viewApp.interviewDateTime ? format(new Date(viewApp.interviewDateTime), 'MMM dd, yyyy HH:mm') : '-'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Interviewer</h4>
                      <p className="text-gray-800">{viewApp.interviewerName || '-'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                      <p className="text-gray-800">{viewApp.location || '-'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback</h4>
                      <p className="text-gray-800">{viewApp.feedback || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                      <p className="text-gray-800 whitespace-pre-line">{viewApp.notes || '-'}</p>
                    </div>
                    {(viewApp.status === 'OFFERED' || viewApp.status === 'HIRED') && (
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Offer Details</h4>
                        <p className="text-gray-800 whitespace-pre-line">{viewApp.offerDetails || '-'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeViewModal}
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleEditSubmit}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Application</h3>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interview Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="interviewDateTime"
                        value={editForm.interviewDateTime}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interviewer Name
                      </label>
                      <input
                        type="text"
                        name="interviewerName"
                        value={editForm.interviewerName}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback
                      </label>
                      <textarea
                        name="feedback"
                        value={editForm.feedback}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={editForm.notes}
                        onChange={handleEditChange}
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {(editForm.status === 'OFFERED' || editForm.status === 'HIRED') && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Offer Details
                        </label>
                        <textarea
                          name="offerDetails"
                          value={editForm.offerDetails}
                          onChange={handleEditChange}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminJobApplications;