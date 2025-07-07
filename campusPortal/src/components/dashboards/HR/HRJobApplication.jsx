import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  GraduationCap, 
  BookOpen,
  Filter,
  X,
  RefreshCw,
  Loader,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../../../components/BackButton";
import Pagination from "../../Pagination";

const statusOptions = [
  { value: "APPLIED", label: "Applied", color: "blue" },
  { value: "UNDER_REVIEW", label: "Under Review", color: "yellow" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled", color: "indigo" },
  { value: "REJECTED", label: "Rejected", color: "red" },
  { value: "OFFERED", label: "Offered", color: "green" },
  { value: "HIRED", label: "Hired", color: "emerald" }
];

const degreeOptions = ["B.Tech", "M.Tech", "BCA", "MCA"];
const branchOptions = ["C.E.", "I.T.", "I.C.", "M.H.", "C.L.", "C.H."];

const HrJobApplications = () => {
  const jobId = localStorage.getItem("selectedJobId");
  console.log("Selected Job ID from localStorage:", jobId);

  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    degree: "",
    branch: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedApplication, setExpandedApplication] = useState(null);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  const fetchApplications = useCallback(async () => {
  try {
    setLoading(true);

    // Get and validate jobId
    const selectedJobId =
      jobId && jobId !== "null" && jobId !== "undefined" ? jobId : null;

    // Use HR-specific endpoint if jobId is not provided
    const url = selectedJobId
      ? `/job-applications/job/${selectedJobId}`
      : `/job-applications/hr`; // 🔁 changed from /job-applications

    console.log("Fetching applications from:", url); // ✅ For debugging

    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setApplications(res.data);
    setFilteredApps(res.data);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load applications");
    console.error("Error fetching applications:", error);
  } finally {
    setLoading(false);
    setInitialLoad(false);
  }
}, [jobId, token]);




  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    let filtered = [...applications];

    if (filters.status) {
      filtered = filtered.filter((app) => app.status === filters.status);
    }
    if (filters.degree) {
      filtered = filtered.filter((app) => app.degree === filters.degree);
    }
    if (filters.branch) {
      filtered = filtered.filter((app) => app.branch === filters.branch);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.studentName && app.studentName.toLowerCase().includes(term)) ||
        (app.degree && app.degree.toLowerCase().includes(term)) ||
        (app.branch && app.branch.toLowerCase().includes(term)))
    }

    setFilteredApps(filtered);
    setCurrentPage(1);
  }, [filters, applications, searchTerm]);

  const handleViewApplications = (jobId) => {
  localStorage.setItem("selectedJobId", jobId);
  navigate("/hr/job-applications"); // or whatever route you're using
};


  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(
        `/job-applications/${applicationId}/status?status=${newStatus}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Status updated successfully");
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      degree: "",
      branch: ""
    });
    setSearchTerm("");
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleApplicationExpand = (id) => {
    setExpandedApplication(expandedApplication === id ? null : id);
  };

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const currentItems = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (initialLoad) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 rounded-full animate-ping"></div>
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

        

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                    <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Job Applications
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {jobId ? `For Job ID: ${jobId}` : "All Applications"} ({filteredApps.length})
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
                  placeholder="Search by name, degree or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.status || filters.degree || filters.branch
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {(filters.status || filters.degree || filters.branch) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    {[filters.status, filters.degree, filters.branch].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
                
                {(filters.status || filters.degree || filters.branch || searchTerm) && (
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
            ) : filteredApps.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <FileText className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No applications found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {filters.status || filters.degree || filters.branch || searchTerm
                    ? "Try adjusting your search criteria"
                    : "No applications have been submitted yet"}
                </p>
                {(filters.status || filters.degree || filters.branch || searchTerm) && (
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
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
                              <div className="font-medium text-gray-900">{app.studentName || "N/A"}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{app.degree || "N/A"}</span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{app.branch || "N/A"}</span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
                                    statusOptions.find(s => s.value === app.status)?.color 
                                      ? `bg-${statusOptions.find(s => s.value === app.status).color}-100 text-${statusOptions.find(s => s.value === app.status).color}-800`
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {app.status.replace(/_/g, " ")}
                                </span>
                                <select
                                  value={app.status}
                                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                  disabled={app.status === "HIRED"}
                                  className={`text-xs rounded-full px-2 py-1 focus:outline-none focus:ring-1 ${
                                    statusOptions.find(s => s.value === app.status)?.color 
                                      ? `bg-${statusOptions.find(s => s.value === app.status).color}-100 text-${statusOptions.find(s => s.value === app.status).color}-800`
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {statusOptions
                                    .filter(status => status.value !== "APPLIED" && status.value !== "HIRED")
                                    .map(status => (
                                      <option 
                                        key={status.value} 
                                        value={status.value}
                                        className={`bg-${status.color}-100 text-${status.color}-800`}
                                      >
                                        {status.label}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {app.resumeLink ? (
                                <a
                                  href={app.resumeLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline inline-flex items-center text-sm"
                                >
                                  View Resume
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                              ) : (
                                "N/A"
                              )}
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
                    <div key={app.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                      <div 
                        className="p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleApplicationExpand(app.id)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{app.studentName || "N/A"}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <GraduationCap className="w-3 h-3 mr-1 text-gray-400" />
                            {app.degree || "N/A"} | {app.branch || "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusOptions.find(s => s.value === app.status)?.color 
                                ? `bg-${statusOptions.find(s => s.value === app.status).color}-100 text-${statusOptions.find(s => s.value === app.status).color}-800`
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {app.status.replace(/_/g, " ")}
                          </span>
                          <MoreHorizontal className="ml-2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      
                      {expandedApplication === app.id && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-gray-500">Status</p>
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                disabled={app.status === "HIRED"}
                                className={`text-xs rounded-full px-2 py-1 focus:outline-none focus:ring-1 ${
                                  statusOptions.find(s => s.value === app.status)?.color 
                                    ? `bg-${statusOptions.find(s => s.value === app.status).color}-100 text-${statusOptions.find(s => s.value === app.status).color}-800`
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {statusOptions
                                  .filter(status => status.value !== "APPLIED" && status.value !== "HIRED")
                                  .map(status => (
                                    <option 
                                      key={status.value} 
                                      value={status.value}
                                      className={`bg-${status.color}-100 text-${status.color}-800`}
                                    >
                                      {status.label}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          {app.resumeLink && (
                            <a
                              href={app.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center text-sm"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View Resume
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredApps.length > itemsPerPage && (
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredApps.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrJobApplications;