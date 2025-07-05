import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiPhone,
  FiMessageSquare,
  FiClock,
  FiFilter,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiArrowLeft
} from "react-icons/fi";
import BackButton from "../../../components/BackButton";

const statusOptions = [
  { value: "APPLIED", label: "Applied", color: "blue" },
  { value: "UNDER_REVIEW", label: "Under Review", color: "yellow" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview", color: "purple" },
  { value: "OFFERED", label: "Offered", color: "green" },
  { value: "HIRED", label: "Hired", color: "emerald" },
  { value: "REJECTED", label: "Rejected", color: "red" }
];

const statusIcons = {
  APPLIED: <FiClock className="text-blue-500" />,
  UNDER_REVIEW: <FiMessageSquare className="text-yellow-500" />,
  INTERVIEW_SCHEDULED: <FiCalendar className="text-purple-500" />,
  OFFERED: <FiBriefcase className="text-green-500" />,
  HIRED: <FiUser className="text-emerald-500" />,
  REJECTED: <FiPhone className="text-red-500" />
};

const HiringPipeline = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    degree: "",
    branch: ""
  });
  const [expandedCards, setExpandedCards] = useState({});
  const { jobId } = useParams();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/job-applications/hr/pipeline`);
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to load job applications", error);
        toast.error("Failed to load job applications");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplications();
  }, [jobId]);

  const resetFilters = () => {
    setFilters({
      degree: "",
      branch: ""
    });
    setSearchTerm("");
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleCardExpand = (status, id) => {
    setExpandedCards(prev => ({
      ...prev,
      [status]: prev[status] === id ? null : id
    }));
  };

  const filteredApplications = (status) => {
    let apps = applications[status] || [];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      apps = apps.filter(app => 
        (app.studentName && app.studentName.toLowerCase().includes(term)) ||
        (app.degree && app.degree.toLowerCase().includes(term)) ||
        (app.branch && app.branch.toLowerCase().includes(term)))
    }
    
    if (filters.degree) {
      apps = apps.filter(app => app.degree === filters.degree);
    }
    
    if (filters.branch) {
      apps = apps.filter(app => app.branch === filters.branch);
    }
    
    return apps;
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
                    <FiBriefcase className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Hiring Pipeline
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    Track candidates through the hiring process
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={() => window.location.reload()}
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
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.branch || filters.degree
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {(filters.branch || filters.degree) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    {[filters.branch, filters.degree].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
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
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="IC">IC</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Chemical">Chemical</option>
                    </select>
                  </div>
                </div>
                
                {(filters.branch || filters.degree || searchTerm) && (
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

          {/* Pipeline Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {statusOptions.map((status) => {
              const filteredApps = filteredApplications(status.value);
              
              return (
                <div key={status.value} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className={`flex items-center justify-between p-4 bg-${status.color}-100 text-${status.color}-800`}>
                    <h3 className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        {statusIcons[status.value]}
                        {status.label}
                      </div>
                    </h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white bg-opacity-30">
                      {filteredApps.length}
                    </span>
                  </div>

                  <div className="p-4">
                    {filteredApps.length > 0 ? (
                      <div className="space-y-4">
                        {filteredApps.map((app) => (
                          <div 
                            key={app.id} 
                            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 cursor-pointer"
                            onClick={() => toggleCardExpand(status.value, app.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FiUser className="text-indigo-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {app.studentName || "Unknown Candidate"}
                                  </h4>
                                  {expandedCards[status.value] === app.id ? (
                                    <FiChevronUp className="text-gray-400" />
                                  ) : (
                                    <FiChevronDown className="text-gray-400" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <div className="flex items-center gap-2">
                                    <FiBriefcase className="flex-shrink-0" />
                                    <span>{app.degree || "-"} in {app.branch || "-"}</span>
                                  </div>
                                </div>
                                
                                {expandedCards[status.value] === app.id && (
                                  <div className="mt-2 space-y-2">
                                    {app.interviewDateTime && (
                                      <div className="text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                          <FiCalendar className="flex-shrink-0" />
                                          <span>
                                            Interview: {new Date(app.interviewDateTime).toLocaleDateString()} at{" "}
                                            {new Date(app.interviewDateTime).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit"
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {app.interviewerName && (
                                      <div className="text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                          <FiUser className="flex-shrink-0" />
                                          <span>Interviewer: {app.interviewerName}</span>
                                        </div>
                                      </div>
                                    )}
                                    {app.feedback && (
                                      <div className="text-xs text-gray-500">
                                        <div className="flex items-start gap-2">
                                          <FiMessageSquare className="flex-shrink-0 mt-0.5" />
                                          <span>Feedback: {app.feedback}</span>
                                        </div>
                                      </div>
                                    )}
                                    {app.resumeLink && (
                                      <div className="text-xs text-blue-600 mt-2">
                                        <a
                                          href={app.resumeLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 hover:underline"
                                        >
                                          <FiFileText className="flex-shrink-0" />
                                          View Resume
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No candidates in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringPipeline;