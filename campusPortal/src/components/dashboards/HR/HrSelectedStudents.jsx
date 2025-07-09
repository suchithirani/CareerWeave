import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { 
  FileText, 
  User, 
  GraduationCap, 
  BookOpen,
  Briefcase,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Loader,
  MoreHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import Pagination from "../../Pagination";

const statusOptions = [
  { value: "OFFERED", label: "Offered", color: "green" },
  { value: "ACCEPTED", label: "Accepted", color: "purple" },
  { value: "HIRED", label: "Hired", color: "emerald" }
];

const HrSelectedStudents = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    branch: "",
    degree: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const itemsPerPage = 10;

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/job-applications/hr`);
      const filtered = response.data.filter(app =>
        ["OFFERED", "ACCEPTED", "HIRED"].includes(app.status)
      );
      setCandidates(filtered);
      setFilteredCandidates(filtered);
    } catch (error) {
      console.error("Failed to fetch job applications", error);
      toast.error("Failed to load selected candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = [...candidates];

    if (filters.status) {
      filtered = filtered.filter(candidate => candidate.status === filters.status);
    }
    if (filters.branch) {
      filtered = filtered.filter(candidate => candidate.branch === filters.branch);
    }
    if (filters.degree) {
      filtered = filtered.filter(candidate => candidate.degree === filters.degree);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate => 
        (candidate.studentName && candidate.studentName.toLowerCase().includes(term)) ||
        (candidate.companyName && candidate.companyName.toLowerCase().includes(term)) ||
        (candidate.jobTitle && candidate.jobTitle.toLowerCase().includes(term))
      );
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  }, [filters, candidates, searchTerm]);

  const resetFilters = () => {
    setFilters({
      status: "",
      branch: "",
      degree: ""
    });
    setSearchTerm("");
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleCandidateExpand = (id) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const currentItems = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                    <User className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Briefcase className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Selected Candidates
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {filteredCandidates.length} candidates selected
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchCandidates}
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
                  placeholder="Search by name, company or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.status || filters.branch || filters.degree
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {(filters.status || filters.branch || filters.degree) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    {[filters.status, filters.branch, filters.degree].filter(Boolean).length}
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
                
                {(filters.status || filters.branch || filters.degree || searchTerm) && (
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

          {/* Candidates Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader className="animate-spin h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" />
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <User className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No candidates found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {filters.status || filters.branch || filters.degree || searchTerm
                    ? "Try adjusting your search criteria"
                    : "No candidates have been selected yet"}
                </p>
                {(filters.status || filters.branch || filters.degree || searchTerm) && (
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{candidate.studentName || "-"}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{candidate.degree || "-"}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{candidate.branch || "-"}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{candidate.companyName || "-"}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{candidate.jobTitle || "-"}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
                                statusOptions.find(s => s.value === candidate.status)?.color 
                                  ? `bg-${statusOptions.find(s => s.value === candidate.status).color}-100 text-${statusOptions.find(s => s.value === candidate.status).color}-800`
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {candidate.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>
                                {candidate.appliedAt
                                  ? new Date(candidate.appliedAt).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {candidate.resumeLink ? (
                              <a
                                href={candidate.resumeLink}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3 p-3">
                  {currentItems.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                      <div 
                        className="p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleCandidateExpand(candidate.id)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{candidate.studentName || "-"}</h3>
                          <p className="text-sm text-gray-600">{candidate.jobTitle || "-"}</p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusOptions.find(s => s.value === candidate.status)?.color 
                                ? `bg-${statusOptions.find(s => s.value === candidate.status).color}-100 text-${statusOptions.find(s => s.value === candidate.status).color}-800`
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {candidate.status.replace(/_/g, " ")}
                          </span>
                          <MoreHorizontal className="ml-2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      
                      {expandedCandidate === candidate.id && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Degree</p>
                              <p className="text-sm flex items-center">
                                <GraduationCap className="w-3 h-3 mr-1 text-gray-400" />
                                {candidate.degree || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Branch</p>
                              <p className="text-sm flex items-center">
                                <BookOpen className="w-3 h-3 mr-1 text-gray-400" />
                                {candidate.branch || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Company</p>
                              <p className="text-sm flex items-center">
                                <Briefcase className="w-3 h-3 mr-1 text-gray-400" />
                                {candidate.companyName || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Applied On</p>
                              <p className="text-sm flex items-center">
                                <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                {candidate.appliedAt
                                  ? new Date(candidate.appliedAt).toLocaleDateString()
                                  : "-"}
                              </p>
                            </div>
                          </div>
                          {candidate.resumeLink && (
                            <a
                              href={candidate.resumeLink}
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
                {filteredCandidates.length > itemsPerPage && (
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredCandidates.length}
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

export default HrSelectedStudents;