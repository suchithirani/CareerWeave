import React, { useEffect, useState } from 'react';
import { 
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  UserCheck,
  FileText,
  Download,
  Eye,
  ChevronRight,
  Search,
  Filter,
  X,
  RefreshCw,
  MapPin,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import BackButton from '../../BackButton';

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ONBOARDING', label: 'Onboarding' },
  { value: 'ONBOARDED', label: 'Onboarded' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const StudentOffer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    company: '',
  });
  const [viewOffer, setViewOffer] = useState(null);
  const token = localStorage.getItem('token');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/job-offers/student', getAuthConfig());
      setOffers(res.data);
    } catch (error) {
      toast.error('Failed to fetch job offers');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (id, status) => {
    try {
      await api.put(`/job-offers/${id}/status`, { status }, getAuthConfig());
      toast.success(`Offer ${status.toLowerCase()}`);
      fetchOffers();
    } catch (error) {
      toast.error('Failed to update offer status');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      company: '',
    });
    setSearchTerm('');
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      searchTerm === '' ||
      (offer.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offer.company?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filters.status === '' ||
      offer.status === filters.status;
    
    const matchesCompany = 
      filters.company === '' ||
      offer.company?.toLowerCase().includes(filters.company.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Accepted</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      case 'ONBOARDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Onboarding</span>;
      case 'ONBOARDED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1"><UserCheck className="w-3 h-3" /> Onboarded</span>;
      case 'EXPIRED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Expired</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status || 'Unknown'}</span>;
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : '-';
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '-';
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="bg-white text-black">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 sm:p-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-full mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                                        <Briefcase className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <UserCheck className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                                        Job Offers
                                    </h1>
                                    <p className="text-gray-600 text-sm sm:text-lg font-medium">
                                        {filteredOffers.length} {filteredOffers.length === 1 ? 'offer' : 'offers'} recorded
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 sm:gap-4">
                                <BackButton className="text-sm sm:text-base" />
                                <button
                                    onClick={fetchOffers}
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
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.status || filters.company
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {(filters.status || filters.company) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    {[filters.status, filters.company].filter(Boolean).length}
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
                  
                  {/* Company Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Company</h3>
                    <input
                      type="text"
                      name="company"
                      value={filters.company}
                      onChange={handleFilterChange}
                      placeholder="Filter by company"
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                {(filters.status || filters.company || searchTerm) && (
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

          {/* Offers List */}
          {loading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin h-8 w-8 sm:h-12 sm:w-12 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Briefcase className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No offers found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                {filters.status || filters.company || searchTerm
                  ? "Try adjusting your search criteria"
                  : "You haven't received any job offers yet"}
              </p>
              {(filters.status || filters.company || searchTerm) && (
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
            <div className="space-y-4">
              {filteredOffers.map((offer) => (
                <motion.div 
                  key={offer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden"
                >
                  <div 
                    className="p-4 sm:p-6 flex justify-between items-start cursor-pointer"
                    onClick={() => setViewOffer(offer)}
                  >
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{offer.jobTitle}</h3>
                          <p className="text-sm sm:text-base text-gray-600">{offer.company}</p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(offer.status)}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center text-sm sm:text-base">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                          <span>{offer.location || '-'}</span>
                        </div>
                        <div className="flex items-center text-sm sm:text-base">
                          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                          <span>{formatCurrency(offer.salary)}</span>
                        </div>
                        <div className="flex items-center text-sm sm:text-base">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                          <span>{formatDate(offer.offerDate)}</span>
                        </div>
                        <div className="flex items-center text-sm sm:text-base">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2" />
                          <span>{formatDate(offer.joiningDate)}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                  </div>
                  
                  {offer.status === 'PENDING' && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100 flex justify-end gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResponse(offer.id, 'REJECTED');
                        }}
                        className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResponse(offer.id, 'ACCEPTED');
                        }}
                        className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* View Offer Modal */}
        <AnimatePresence>
          {viewOffer && (
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
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewOffer.jobTitle || 'Job Offer'}</h2>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg text-gray-700">
                          {viewOffer.company || 'Company'}
                        </span>
                        {getStatusBadge(viewOffer.status)}
                      </div>
                    </div>
                    <button
                      onClick={() => setViewOffer(null)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-blue-600" />
                        Company Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Company Name</h4>
                          <p className="text-gray-800">
                            {viewOffer.company || '-'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Job Title</h4>
                          <p className="text-gray-800">
                            {viewOffer.jobTitle || '-'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                          <p className="text-gray-800">
                            {viewOffer.location || '-'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                        Offer Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Salary</h4>
                          <p className="text-gray-800">
                            {formatCurrency(viewOffer.salary)}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Offer Date</h4>
                          <p className="text-gray-800">
                            {formatDate(viewOffer.offerDate)}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Joining Date</h4>
                          <p className="text-gray-800">
                            {formatDate(viewOffer.joiningDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      Offer Letter
                    </h3>
                    {viewOffer.offerLetterUrl ? (
                      <a
                        href={viewOffer.offerLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Offer Letter
                      </a>
                    ) : (
                      <p className="text-gray-600">No offer letter available</p>
                    )}
                  </div>

                  {viewOffer.status === 'PENDING' && (
                    <div className="flex justify-center gap-4 mb-8">
                      <button
                        onClick={() => {
                          handleResponse(viewOffer.id, 'REJECTED');
                          setViewOffer(null);
                        }}
                        className="px-6 py-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-medium flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Offer
                      </button>
                      <button
                        onClick={() => {
                          handleResponse(viewOffer.id, 'ACCEPTED');
                          setViewOffer(null);
                        }}
                        className="px-6 py-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-medium flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept Offer
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setViewOffer(null)}
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
  );
};

export default StudentOffer;