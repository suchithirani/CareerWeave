import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase,
  MapPin,
  Phone,
  ArrowLeft,
  Search,
  Shield,
  Loader,
  AlertCircle,
  ChevronRight,
  FileText,
  X,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../../Pagination';
import BackButton from '../../BackButton';

const OfficerCompany = () => {
  const { companyId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

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

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://localhost:8080/api/co/officer-companies',
        getAuthConfig()
      );
      const data = response.data;

      if (companyId) {
        const filtered = data.find((c) => c.id.toString() === companyId);
        if (filtered) {
          setCompanies([filtered]);
          setFilteredCompanies([filtered]);
        } else {
          toast.error('Company not found or not under your supervision');
          setCompanies([]);
          setFilteredCompanies([]);
        }
      } else {
        setCompanies(data);
        setFilteredCompanies(data);
      }
    } catch (error) {
      toast.error('Failed to fetch companies');
      setError('Failed to load companies.');
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
      industry: ''
    });
    setSearchTerm('');
  };

  useEffect(() => {
    fetchCompanies();
  }, [companyId]);

  useEffect(() => {
    const filtered = companies.filter(
      (company) =>
        (searchTerm === '' ||
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.industry === '' || company.industry === filters.industry)
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, companies, filters]);

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
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                    <Briefcase className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    {companyId ? 'Company Details' : 'Managed Companies'}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {companyId ? 'Detailed company information' : `${filteredCompanies.length} companies under your supervision`}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                    onClick={fetchCompanies}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >

                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Refresh</span>
                  </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          {!companyId && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search by company name or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                    showFilters || filters.industry
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-gray-200 text-gray-700 bg-white/70'
                  }`}
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                  {filters.industry && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      1
                    </span>
                  )}
                </button>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                  
                  {(filters.industry || searchTerm) && (
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
          )}

          {/* Main Content */}
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
            ) : filteredCompanies.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Briefcase className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {searchTerm || filters.industry ? 'No matching companies found' : 'No companies under your supervision'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {searchTerm || filters.industry ? 'Try adjusting your search criteria' : 'Companies assigned to you will appear here'}
                </p>
                {(searchTerm || filters.industry) && (
                  <button
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    Clear Filters
                  </button>
                )}
              </div>
            ) : companyId ? (
              // Single Company View - Full information without scrolling
              <AnimatePresence>
                {filteredCompanies.map((company) => (
                  <motion.div 
                    key={company.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                          Company Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                            <p className="text-gray-800 font-medium">{company.name}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Industry</h4>
                            <p className="text-gray-800">{company.industry}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                            <p className="text-gray-800 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                              {company.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Phone className="w-5 h-5 mr-2 text-purple-600" />
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Info</h4>
                            <p className="text-gray-800">{company.contactInfo || 'Not specified'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                            <p className="text-gray-800">
                              {company.websiteUrl ? (
                                <a 
                                  href={company.websiteUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline inline-flex items-center"
                                >
                                  {company.websiteUrl}
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                              ) : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                        Company Description
                      </h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {company.description || 'No description provided.'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              // Companies List View
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentItems.map((company) => (
                          <motion.tr 
                            key={company.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                            className="transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <Link 
                                to={`/officer/companies/${company.id}`}
                                className="font-medium text-indigo-600 hover:text-indigo-900"
                              >
                                {company.name}
                              </Link>
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
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {company.contactInfo || 'N/A'}
                            </td>
                            
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3 p-3">
                  {currentItems.map((company) => (
                    <motion.div 
                      key={company.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
                    >
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <Link 
                            to={`/officer/companies/${company.id}`}
                            className="font-medium text-indigo-600 hover:text-indigo-900"
                          >
                            {company.name}
                          </Link>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-600">{company.location}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
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
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="text-sm">
                              {company.contactInfo || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                      </div>
                    </motion.div>
                  ))}
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
        </div>
      </div>
    </div>
  );
};

export default OfficerCompany;