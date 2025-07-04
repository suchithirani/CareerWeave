import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Trash2,
  Edit,
  Plus,
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Filter,
  X,
  Loader,
  Eye,
  FileText
} from 'lucide-react';
import BackButton from "../../../components/BackButton";

const statusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'blue' },
  { value: 'COMPLETED', label: 'Completed', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
];

const AdminInterviewSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editSchedule, setEditSchedule] = useState(null);
  const [viewSchedule, setViewSchedule] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    status: '',
    interviewer: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const [form, setForm] = useState({
    interviewDateTime: "",
    interviewerName: "",
    location: "",
    status: "SCHEDULED",
    feedback: "",
    jobApplicationId: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/interview-schedules", config);
      setSchedules(res.data);
      setFilteredSchedules(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load schedules.");
      setSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async () => {
    try {
      const res = await api.get("/job-applications", config);
      setJobApplications(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load applications.");
      setJobApplications([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchJobApplications();
  }, [refresh]);

  useEffect(() => {
    let results = schedules;
    
    if (filters.status) {
      results = results.filter(s => s.status === filters.status);
    }
    
    if (filters.interviewer) {
      results = results.filter(s => 
        s.interviewerName.toLowerCase().includes(filters.interviewer.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(s => 
        s.interviewerName.toLowerCase().includes(searchTerm) || 
        s.location.toLowerCase().includes(searchTerm) ||
        s.jobApplication?.id.toString().includes(searchTerm)
      );
    }
    
    setFilteredSchedules(results);
    setPage(1);
  }, [filters, schedules]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      interviewer: '',
      search: ''
    });
  };

  const handleCreate = async () => {
    if (!form.interviewDateTime || !form.interviewerName || !form.location || !form.jobApplicationId) {
      return toast.error("Please fill all required fields.");
    }

    try {
      const dto = {
        ...form,
        interviewDateTime: new Date(form.interviewDateTime).toISOString()
      };

      await api.post("/interview-schedules", dto, config);
      toast.success("Interview scheduled successfully!");
      setShowCreateModal(false);
      setForm({
        interviewDateTime: "",
        interviewerName: "",
        location: "",
        status: "SCHEDULED",
        feedback: "",
        jobApplicationId: "",
      });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Create error:", error);
      toast.error(error.response?.data?.message || "Failed to create schedule.");
    }
  };

  const handleUpdate = async () => {
    if (!editSchedule) return;
    
    try {
      const dto = {
        ...form,
        interviewDateTime: new Date(form.interviewDateTime).toISOString()
      };

      await api.put(`/interview-schedules/${editSchedule.id}`, dto, config);
      toast.success("Interview updated successfully!");
      setEditSchedule(null);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update schedule.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview schedule?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/interview-schedules/${id}`, config);
      toast.success("Interview schedule deleted!");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete schedule.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingStatus(id);
      await api.put(`/interview-schedules/${id}/status?status=${status}`, {}, config);
      toast.success(`Status updated to ${status}`);
      setRefresh(!refresh);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openEditModal = (schedule) => {
    setEditSchedule(schedule);
    setForm({ 
      interviewDateTime: schedule.interviewDateTime.split('.')[0], // Remove milliseconds for datetime-local input
      interviewerName: schedule.interviewerName,
      location: schedule.location,
      status: schedule.status,
      feedback: schedule.feedback || "",
      jobApplicationId: schedule.jobApplication?.id || ""
    });
  };

  const renderStatusDropdown = (schedule) => (
    <select
      value={schedule.status}
      onChange={(e) => handleStatusUpdate(schedule.id, e.target.value)}
      className={`text-xs rounded-full px-2 py-1 focus:outline-none focus:ring-1 ${
        schedule.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
        schedule.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
        schedule.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
        'bg-purple-100 text-purple-800'
      }`}
      disabled={updatingStatus === schedule.id}
    >
      {statusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {updatingStatus === schedule.id ? 'Updating...' : option.label}
        </option>
      ))}
    </select>
  );

  const renderFormModal = () => (
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
          <h3 className="text-xl font-semibold">
            {editSchedule ? 'Edit' : 'Create'} Interview Schedule
          </h3>
          <button 
            onClick={() => editSchedule ? setEditSchedule(null) : setShowCreateModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date & Time *</label>
            <div className="relative">
              <input
                type="datetime-local"
                name="interviewDateTime"
                value={form.interviewDateTime}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Interviewer *</label>
            <div className="relative">
              <input
                type="text"
                name="interviewerName"
                value={form.interviewerName}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="John Doe"
                required
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Location *</label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Office 101"
                required
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
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
          
          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              name="feedback"
              value={form.feedback}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[100px]"
              placeholder="Optional feedback..."
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Job Application *</label>
            <select
              name="jobApplicationId"
              value={form.jobApplicationId}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            >
              <option value="">Select Job Application</option>
              {jobApplications.map((ja) => (
                <option key={ja.id} value={ja.id}>
                  {`Application ${ja.id} - ${ja.studentName || 'N/A'}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => editSchedule ? setEditSchedule(null) : setShowCreateModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={editSchedule ? handleUpdate : handleCreate}
            disabled={!form.interviewDateTime || !form.interviewerName || !form.location || !form.jobApplicationId}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              (!form.interviewDateTime || !form.interviewerName || !form.location || !form.jobApplicationId) 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {editSchedule ? 'Update Schedule' : 'Create Schedule'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const paginatedSchedules = filteredSchedules.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Get unique interviewers for filter
  const interviewers = [...new Set(schedules.map(s => s.interviewerName).filter(Boolean))];

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
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                    Interview Schedules
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    {filteredSchedules.length} {filteredSchedules.length === 1 ? 'schedule' : 'schedules'} found
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
                  <span>New Schedule</span>
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
                placeholder="Search by interviewer, location, or application ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium ${
                showFilters || filters.status || filters.interviewer
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-700 bg-white/70'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {(filters.status || filters.interviewer) && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {[filters.status, filters.interviewer].filter(Boolean).length}
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
                  
                  {/* Interviewer Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Interviewer</h3>
                    <select
                      name="interviewer"
                      value={filters.interviewer}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">All Interviewers</option>
                      {interviewers.map(interviewer => (
                        <option key={interviewer} value={interviewer}>{interviewer}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(filters.status || filters.interviewer) && (
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

          {/* Schedules Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin h-12 w-12 text-indigo-600" />
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No interview schedules found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {filters.search || filters.status || filters.interviewer 
                    ? "Try adjusting your search criteria" 
                    : "No interview schedules have been created yet"}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Schedule an Interview
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        {['ID', 'Date & Time', 'Interviewer', 'Location', 'Status', 'Student Name', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {paginatedSchedules.map((schedule) => (
                          <motion.tr
                            key={schedule.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{schedule.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">
                                {new Date(schedule.interviewDateTime).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">{schedule.interviewerName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">{schedule.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderStatusDropdown(schedule)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">
                                {schedule.jobApplication?.student?.user?.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setViewSchedule(schedule)}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="View"
                              >
                                <Eye size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditModal(schedule)}
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(schedule.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                                disabled={deletingId === schedule.id}
                              >
                                {deletingId === schedule.id ? (
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
                      <span className="font-medium">{Math.min(page * itemsPerPage, filteredSchedules.length)}</span> of{' '}
                      <span className="font-medium">{filteredSchedules.length}</span> schedules
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
            {editSchedule && renderFormModal()}
            {showCreateModal && renderFormModal()}
          </AnimatePresence>

          {/* View Schedule Modal */}
          <AnimatePresence>
            {viewSchedule && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          Interview Details
                        </h2>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            viewSchedule.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            viewSchedule.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            viewSchedule.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {statusOptions.find(s => s.value === viewSchedule.status)?.label || viewSchedule.status}
                          </span>
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
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Interview Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Interviewer</h4>
                            <p className="text-gray-800">{viewSchedule.interviewerName}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                            <p className="text-gray-800">
                              {new Date(viewSchedule.interviewDateTime).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                          Location Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                            <p className="text-gray-800">{viewSchedule.location}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Job Application</h4>
                            <p className="text-gray-800">
                              {viewSchedule.jobApplication?.id ? 
                                `Application #${viewSchedule.jobApplication.id}` : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {viewSchedule.feedback && (
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                          Feedback
                        </h3>
                        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                          {viewSchedule.feedback}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setViewSchedule(null)}
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

export default AdminInterviewSchedule;