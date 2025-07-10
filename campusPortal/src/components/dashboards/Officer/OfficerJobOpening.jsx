import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../BackButton';
import Pagination from '../../Pagination';

const OfficerJobOpenings = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    location: '',
    minSalary: '',
    maxSalary: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewJob, setViewJob] = useState(null);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

  const statusOptions = [
    'OPEN',
    'CLOSED',
    'DRAFT',
    'FILLED',
    'EXPIRED',
    'CANCELLED'
  ];

  const salaryRangeOptions = [
    { label: '0-5 LPA', value: '0-5' },
    { label: '5-10 LPA', value: '5-10' },
    { label: '10-15 LPA', value: '10-15' },
    { label: '15+ LPA', value: '15+' }
  ];

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchJobOpenings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8080/api/job-openings/officer', getAuthConfig());
      console.log('Job Openings Response:', res.data);

      if (Array.isArray(res.data)) {
        setJobOpenings(res.data);
      } else if (res.data.content && Array.isArray(res.data.content)) {
        setJobOpenings(res.data.content);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      console.error('Error fetching job openings:', err);
      setError('Failed to fetch job openings');
      toast.error('Failed to fetch job openings');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/company', getAuthConfig());
      setCompanies(res.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies');
    }
  };

  const getCompanyName = (company) => {
    if (!company) return 'Unknown';
    if (typeof company === 'number' || typeof company === 'string') {
      const companyObj = companies.find((c) => c.id === Number(company));
      return companyObj ? companyObj.name : 'Unknown';
    }
    return company.name || 'Unknown';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      company: '',
      location: '',
      minSalary: '',
      maxSalary: ''
    });
    setSearchTerm('');
  };

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = 
      searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompanyName(job.company).toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filters.status === '' ||
      job.status === filters.status;
    
    const matchesCompany = 
      filters.company === '' ||
      (typeof job.company === 'object' ? job.company.id : job.company) == filters.company;
    
    const matchesLocation = 
      filters.location === '' ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesMinSalary = 
      filters.minSalary === '' ||
      (job.salaryLPA && job.salaryLPA >= Number(filters.minSalary));
    
    const matchesMaxSalary = 
      filters.maxSalary === '' ||
      (job.salaryLPA && job.salaryLPA <= Number(filters.maxSalary));
    
    return matchesSearch && matchesStatus && matchesCompany && matchesLocation && matchesMinSalary && matchesMaxSalary;
  });

  useEffect(() => {
    fetchJobOpenings();
    fetchCompanies();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

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
                    Job Openings
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job opening' : 'job openings'} available
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
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by title, company or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.status || filters.company || filters.location || filters.minSalary || filters.maxSalary
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {(filters.status || filters.company || filters.location || filters.minSalary || filters.maxSalary) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    {[filters.status, filters.company, filters.location, filters.minSalary, filters.maxSalary].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Company Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Company</h3>
                    <select
                      name="company"
                      value={filters.company}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">All Companies</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Location</h3>
                    <input
                      type="text"
                      name="location"
                      placeholder="Filter by location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>

                  {/* Salary Range Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Min Salary (LPA)</h3>
                    <input
                      type="number"
                      name="minSalary"
                      placeholder="Minimum salary"
                      value={filters.minSalary}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Max Salary (LPA)</h3>
                    <input
                      type="number"
                      name="maxSalary"
                      placeholder="Maximum salary"
                      value={filters.maxSalary}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Quick Salary Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {salaryRangeOptions.map(range => (
                        <button
                          key={range.value}
                          onClick={() => {
                            const [min, max] = range.value.includes('+') 
                              ? [range.value.replace('+', ''), ''] 
                              : range.value.split('-');
                            setFilters(prev => ({
                              ...prev,
                              minSalary: min,
                              maxSalary: max
                            }));
                          }}
                          className={`px-3 py-1 text-xs rounded-full border ${
                            filters.minSalary === (range.value.includes('+') ? range.value.replace('+', '') : range.value.split('-')[0]) &&
                            filters.maxSalary === (range.value.includes('+') ? '' : range.value.split('-')[1])
                              ? 'bg-blue-100 border-blue-300 text-blue-800'
                              : 'bg-white border-gray-300 text-gray-700'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {(filters.status || filters.company || filters.location || filters.minSalary || filters.maxSalary || searchTerm) && (
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

          {/* Job Openings Table */}
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
            ) : filteredJobs.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Briefcase className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No job openings found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {filters.status || filters.company || filters.location || filters.minSalary || filters.maxSalary || searchTerm
                    ? "Try adjusting your search criteria"
                    : "No job openings have been posted yet"}
                </p>
                {(filters.status || filters.company || filters.location || filters.minSalary || filters.maxSalary || searchTerm) && (
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentItems.map((job) => {
                          const statusColor = {
                            OPEN: 'bg-green-100 text-green-800',
                            CLOSED: 'bg-red-100 text-red-800',
                            DRAFT: 'bg-gray-100 text-gray-800',
                            FILLED: 'bg-blue-100 text-blue-800',
                            EXPIRED: 'bg-yellow-100 text-yellow-800',
                            CANCELLED: 'bg-purple-100 text-purple-800'
                          }[job.status] || 'bg-gray-100 text-gray-800';

                          return (
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
                                <div className="text-xs sm:text-sm text-gray-500 line-clamp-1">{job.description}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{getCompanyName(job.company)}</span>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{job.location}</span>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{job.salaryLPA || 'N/A'} LPA</span>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                  {job.status}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-center items-center space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setViewJob(job)}
                                    className="text-indigo-600 hover:text-indigo-900 p-1 flex items-center"
                                    title="View Details"
                                  >
                                    <Eye size={16} />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3 p-3">
                  {currentItems.map((job) => {
                    const statusColor = {
                      OPEN: 'bg-green-100 text-green-800',
                      CLOSED: 'bg-red-100 text-red-800',
                      DRAFT: 'bg-gray-100 text-gray-800',
                      FILLED: 'bg-blue-100 text-blue-800',
                      EXPIRED: 'bg-yellow-100 text-yellow-800',
                      CANCELLED: 'bg-purple-100 text-purple-800'
                    }[job.status] || 'bg-gray-100 text-gray-800';

                    return (
                      <motion.div 
                        key={job.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
                      >
                        <div 
                          className="p-4 flex justify-between items-center"
                          onClick={() => setViewJob(job)}
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            <div className="flex items-center mt-1">
                              <Building className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-600">{getCompanyName(job.company)}</span>
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
                                {job.salaryLPA || 'N/A'} LPA
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
                                <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
                                  {job.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
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

          {/* View Job Modal */}
          <AnimatePresence>
            {viewJob && (
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewJob.title}</h2>
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {viewJob.status}
                          </span>
                          <div className="flex items-center text-gray-600">
                            <Building className="w-4 h-4 mr-1" />
                            <span>{getCompanyName(viewJob.company)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewJob(null)}
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
                              {viewJob.location}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Salary</h4>
                            <p className="text-gray-800 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                              {viewJob.salaryLPA || 'Not specified'} LPA
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Application Deadline</h4>
                            <p className="text-gray-800 flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                              {new Date(viewJob.applicationDeadline).toLocaleDateString()}
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
                          {viewJob.eligibilityCriteria || 'No specific eligibility criteria provided.'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                        Job Description
                      </h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {viewJob.description || 'No detailed description provided.'}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setViewJob(null)}
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

export default OfficerJobOpenings;