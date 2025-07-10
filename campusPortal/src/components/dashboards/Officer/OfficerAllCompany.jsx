import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Briefcase,
  Shield,
  Plus,
  RefreshCw,
  AlertCircle,
  Loader,
  Search,
  Filter,
  X,
  Eye,
  MapPin,
  Check,
  X as XIcon,
  MoreHorizontal,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../BackButton';
import Pagination from '../../Pagination';

const OfficerAllCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [assignedCompanies, setAssignedCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCompanyId, setLoadingCompanyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    industry: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewCompany, setViewCompany] = useState(null);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

  const statusOptions = [
    { value: 'ASSIGNED', label: 'Assigned', color: 'green' },
    { value: 'UNASSIGNED', label: 'Unassigned', color: 'red' }
  ];

  const industryOptions = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail'
  ];

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchAllCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allRes, assignedRes] = await Promise.all([
        axios.get('http://localhost:8080/api/company', getAuthConfig()),
        axios.get('http://localhost:8080/api/co/officer-companies', getAuthConfig()),
      ]);
      setCompanies(allRes.data);
      setAssignedCompanies(assignedRes.data.map((c) => c.id));
    } catch (error) {
      setError('Failed to fetch companies');
      toast.error('Failed to fetch companies');
      console.error(error);
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
      status: '',
      industry: ''
    });
    setSearchTerm('');
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      searchTerm === '' ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filters.status === '' ||
      (filters.status === 'ASSIGNED' && assignedCompanies.includes(company.id)) ||
      (filters.status === 'UNASSIGNED' && !assignedCompanies.includes(company.id));
    
    const matchesIndustry = 
      filters.industry === '' ||
      company.industry === filters.industry;
    
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const handleAssign = async (companyId) => {
    if (!window.confirm('Are you sure you want to assign this company?')) return;
    setLoadingCompanyId(companyId);
    try {
      await axios.post(`http://localhost:8080/api/co/assign/${companyId}`, null, getAuthConfig());
      toast.success('Company assigned successfully');
      fetchAllCompanies();
    } catch (error) {
      toast.error('Failed to assign company');
      console.error(error);
    } finally {
      setLoadingCompanyId(null);
    }
  };

  const handleUnassign = async (companyId) => {
    if (!window.confirm('Are you sure you want to unassign this company?')) return;
    setLoadingCompanyId(companyId);
    try {
      await axios.delete(`http://localhost:8080/api/co/unassign/${companyId}`, getAuthConfig());
      toast.success('Company unassigned successfully');
      fetchAllCompanies();
    } catch (error) {
      toast.error('Failed to unassign company');
      console.error(error);
    } finally {
      setLoadingCompanyId(null);
    }
  };

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);

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
                    All Registered Companies
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} registered
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchAllCompanies}
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
                  placeholder="Search by company name, industry or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.status || filters.industry
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {(filters.status || filters.industry) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    {[filters.status, filters.industry].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

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
                      <option value="">All Statuses</option>
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Industry Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Industry</h3>
                    <select
                      name="industry"
                      value={filters.industry}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">All Industries</option>
                      {industryOptions.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(filters.status || filters.industry || searchTerm) && (
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

          {/* Companies Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <Loader className="animate-spin h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" />
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Briefcase className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No companies found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {filters.status || filters.industry || searchTerm
                    ? "Try adjusting your search criteria"
                    : "No companies have been registered yet"}
                </p>
                {(filters.status || filters.industry || searchTerm) && (
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentItems.map((company) => {
                          const isAssigned = assignedCompanies.includes(company.id);
                          const isButtonLoading = loadingCompanyId === company.id;

                          return (
                            <motion.tr
                              key={company.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{company.name}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{company.description || 'No description'}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {company.industry}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                  <span>{company.location}</span>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isAssigned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {isAssigned ? 'Assigned' : 'Unassigned'}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setViewCompany(company)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </motion.button>
                                {isAssigned ? (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleUnassign(company.id)}
                                    disabled={isButtonLoading}
                                    className={`text-red-600 hover:text-red-900 p-1 ${isButtonLoading ? 'opacity-70' : ''}`}
                                    title="Unassign"
                                  >
                                    {isButtonLoading ? (
                                      <Loader className="animate-spin h-3 w-3" />
                                    ) : (
                                      <XIcon size={16} />
                                    )}
                                  </motion.button>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAssign(company.id)}
                                    disabled={isButtonLoading}
                                    className={`text-green-600 hover:text-green-900 p-1 ${isButtonLoading ? 'opacity-70' : ''}`}
                                    title="Assign"
                                  >
                                    {isButtonLoading ? (
                                      <Loader className="animate-spin h-3 w-3" />
                                    ) : (
                                      <Check size={16} />
                                    )}
                                  </motion.button>
                                )}
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
                  {currentItems.map((company) => {
                    const isAssigned = assignedCompanies.includes(company.id);
                    const isButtonLoading = loadingCompanyId === company.id;

                    return (
                      <div key={company.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                        <div 
                          className="p-4 flex justify-between items-center"
                          onClick={() => setViewCompany(company)}
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">{company.name}</h3>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-600">{company.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isAssigned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {isAssigned ? 'Assigned' : 'Unassigned'}
                            </span>
                            <MoreHorizontal className="ml-2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Industry</p>
                              <p className="text-sm">
                                {company.industry}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Description</p>
                              <p className="text-sm line-clamp-1">
                                {company.description || 'No description'}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            {isAssigned ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUnassign(company.id)}
                                disabled={isButtonLoading}
                                className={`text-red-600 hover:text-red-900 p-1 ${isButtonLoading ? 'opacity-70' : ''}`}
                                title="Unassign"
                              >
                                {isButtonLoading ? (
                                  <Loader className="animate-spin h-3 w-3" />
                                ) : 'Unassign'}
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAssign(company.id)}
                                disabled={isButtonLoading}
                                className={`text-green-600 hover:text-green-900 p-1 ${isButtonLoading ? 'opacity-70' : ''}`}
                                title="Assign"
                              >
                                {isButtonLoading ? (
                                  <Loader className="animate-spin h-3 w-3" />
                                ) : 'Assign'}
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {filteredCompanies.length > itemsPerPage && (
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredCompanies.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* View Company Modal */}
          <AnimatePresence>
            {viewCompany && (
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewCompany.name}</h2>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            assignedCompanies.includes(viewCompany.id) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {assignedCompanies.includes(viewCompany.id) ? 'Assigned' : 'Unassigned'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewCompany(null)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                          Company Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Industry</h4>
                            <p className="text-gray-800">
                              {viewCompany.industry}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                            <p className="text-gray-800 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                              {viewCompany.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-purple-600" />
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Info</h4>
                            <p className="text-gray-800">
                              {viewCompany.contactInfo || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                            <p className="text-gray-800">
                              {viewCompany.websiteUrl ? (
                                <a href={viewCompany.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {viewCompany.websiteUrl}
                                </a>
                              ) : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                        Company Description
                      </h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {viewCompany.description || 'No description provided.'}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      {assignedCompanies.includes(viewCompany.id) ? (
                        <button
                          onClick={() => {
                            setViewCompany(null);
                            handleUnassign(viewCompany.id);
                          }}
                          className="px-6 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 hover:bg-red-100 transition-colors font-medium"
                        >
                          Unassign Company
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setViewCompany(null);
                            handleAssign(viewCompany.id);
                          }}
                          className="px-6 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 hover:bg-green-100 transition-colors font-medium"
                        >
                          Assign Company
                        </button>
                      )}
                      <button
                        onClick={() => setViewCompany(null)}
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

export default OfficerAllCompany;