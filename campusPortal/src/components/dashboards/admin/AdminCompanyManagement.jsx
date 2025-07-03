import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Calendar, 
  Bell,
  BarChart3,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  Shield,
  Activity,
  Award,
  Eye,
  Search,
  Trash2,
  Edit,
  Plus,
  ArrowLeft,
  Filter,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

const AdminCompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    industry: '',
    location: '',
    companyType: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  
  const companiesPerPage = 10;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/company', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data);
        setFilteredCompanies(res.data);
      } catch (error) {
        toast.error('Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [token]);

  // Fetch single company details
  const fetchCompanyDetails = async (id) => {
    try {
      const res = await api.get(`/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCompany(res.data);
      setShowCompanyModal(true);
    } catch (error) {
      toast.error('Failed to fetch company details');
    }
  };

  // Filter companies
  useEffect(() => {
    let filtered = [...companies];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.industry && c.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.hrName && c.hrName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.companyType && c.companyType.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (activeFilters.industry) {
      filtered = filtered.filter(c => 
        c.industry && c.industry.toLowerCase() === activeFilters.industry.toLowerCase()
      );
    }
    
    if (activeFilters.location) {
      filtered = filtered.filter(c => 
        c.location && c.location.toLowerCase() === activeFilters.location.toLowerCase()
      );
    }

    if (activeFilters.companyType) {
      filtered = filtered.filter(c => 
        c.companyType && c.companyType.toLowerCase() === activeFilters.companyType.toLowerCase()
      );
    }

    if (activeFilters.status) {
      filtered = filtered.filter(c => 
        c.status && c.status.toLowerCase() === activeFilters.status.toLowerCase()
      );
    }
    
    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [searchTerm, activeFilters, companies]);

  // Get unique values for filters
  const industries = [...new Set(companies.map(c => c.industry).filter(Boolean))];
  const locations = [...new Set(companies.map(c => c.location).filter(Boolean))];
  const companyTypes = ['PRODUCT', 'SERVICE', 'STARTUP', 'MNC', 'CONSULTANCY', 'PRIVATE_COMPANY', 'GOVERNMENT', 'PUBLIC'];

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;

    try {
      await api.delete(`/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = companies.filter((c) => c.id !== id);
      setCompanies(updated);
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value === prev[filterName] ? '' : value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      industry: '',
      location: '',
      companyType: '',
      status: ''
    });
    setSearchTerm('');
  };

  const indexOfLast = currentPage * companiesPerPage;
  const indexOfFirst = indexOfLast - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  const formatCompanyType = (type) => {
    if (!type) return '-';
    return type.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatStatus = (status) => {
    if (!status) return '-';
    return status.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING_VERIFICATION':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLACKLISTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white">
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
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Activity className="w-3 h-3 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                  Company Management
                </h1>
                <p className="text-gray-600 text-lg font-medium">
                  {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} registered
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
              <BackButton/>
              <button 
                onClick={() => navigate('/admin/company/create')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
              >
                <Plus className="w-5 h-5" />
                <span>Add Company</span>
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
                placeholder="Search companies by name, industry, location, HR name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium ${
                showFilters || activeFilters.industry || activeFilters.location || activeFilters.companyType || activeFilters.status
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-700 bg-white/70'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {(activeFilters.industry || activeFilters.location || activeFilters.companyType || activeFilters.status) && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {[activeFilters.industry, activeFilters.location, activeFilters.companyType, activeFilters.status].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Industry</h3>
                  <div className="space-y-2">
                    {industries.map(industry => (
                      <button
                        key={industry}
                        onClick={() => handleFilterChange('industry', industry)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                          activeFilters.industry === industry
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Location</h3>
                  <div className="space-y-2">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => handleFilterChange('location', location)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                          activeFilters.location === location
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Company Type</h3>
                  <div className="space-y-2">
                    {companyTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('companyType', type)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                          activeFilters.companyType === type
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {formatCompanyType(type)}
                      </button>
                    ))}
                  </div>
                </div>

                
              </div>
              
              {(activeFilters.industry || activeFilters.location || activeFilters.companyType || activeFilters.status) && (
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

        {/* Companies Table */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="relative">
                <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
                <div className="absolute inset-0 w-10 h-10 border-2 border-blue-200 rounded-full animate-ping"></div>
              </div>
              <span className="mt-4 text-gray-600 font-medium">Loading company data...</span>
            </div>
          ) : currentCompanies.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm || activeFilters.industry || activeFilters.location || activeFilters.companyType || activeFilters.status
                  ? "Try adjusting your search or filter criteria"
                  : "No companies have been registered yet"}
              </p>
              <button
                onClick={() => navigate('/admin/company/create')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Company
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR Contact</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{company.name}</div>
                              <div className="text-xs text-gray-500">
                                {company.websiteUrl ? (
                                  <a 
                                    href={company.websiteUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline truncate max-w-xs inline-block"
                                  >
                                    {company.websiteUrl.replace(/^https?:\/\//, '')}
                                  </a>
                                ) : '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {company.industry || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {company.location || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {formatCompanyType(company.companyType) || '-'}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.hrName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => fetchCompanyDetails(company.id)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/company/edit/${company.id}`)}
                              className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCompany(company.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredCompanies.length > companiesPerPage && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between bg-gray-50">
                  <div className="text-sm text-gray-700 mb-4 md:mb-0">
                    Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLast, filteredCompanies.length)}</span> of{' '}
                    <span className="font-medium">{filteredCompanies.length}</span> companies
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
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Company Details Modal */}
        {showCompanyModal && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCompany.name}</h2>
                    <div className="flex items-center space-x-4">
                      
                      <span className="text-gray-600">{selectedCompany.industry}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCompanyModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Company ID</h4>
                        <p className="text-gray-800">{selectedCompany.id}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                        <p className="text-gray-800">{formatCompanyType(selectedCompany.companyType)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                        <p className="text-gray-800">{selectedCompany.location || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                        {selectedCompany.websiteUrl ? (
                          <a 
                            href={selectedCompany.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center"
                          >
                            {selectedCompany.websiteUrl}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </a>
                        ) : (
                          <p className="text-gray-800">-</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Primary Contact Email</h4>
                        <p className="text-gray-800">{selectedCompany.contactInfo || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Primary HR Contact</h4>
                        <p className="text-gray-800">{selectedCompany.hrName || '-'}</p>
                      </div>
                      
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Description</h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <p className="text-gray-800 whitespace-pre-line">
                      {selectedCompany.description || 'No description available'}
                    </p>
                  </div>
                </div>

                {selectedCompany.companyHRNames && selectedCompany.companyHRNames.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">HR Contacts</h3>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            
                            
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedCompany.companyHRNames.map((name, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{name}</td>
                              
                              
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {selectedCompany.companyHRRoles?.[index] || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCompanyModal(false)}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowCompanyModal(false);
                      navigate(`/admin/company/edit/${selectedCompany.id}`);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
                  >
                    Edit Company
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminCompanyManagement;