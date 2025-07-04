import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  X, 
  Filter, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  User,
  Calendar,
  DollarSign,
  Clock,
  Loader,
  Plus,
  Search
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import BackButton from '../../../components/BackButton';

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'green' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
  { value: 'ONBOARDING', label: 'Onboarding', color: 'blue' },
  { value: 'ONBOARDED', label: 'Onboarded', color: 'purple' }
];

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');
const companyOptions = [...new Set(offers.map(offer => offer.company))].filter(Boolean);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    let results = offers;
    
    if (filters.status) {
      results = results.filter(offer => offer.status === filters.status);
    }
    
    if (filters.company) {
      results = results.filter(offer => 
        offer.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(offer => 
        offer.candidateName.toLowerCase().includes(searchTerm) || 
        offer.jobTitle.toLowerCase().includes(searchTerm))
    }
    
    setFilteredOffers(results);
    setPage(1);
  }, [filters, offers]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/job-offers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffers(res.data);
      setFilteredOffers(res.data);
    } catch (error) {
      toast.error('Failed to fetch offers');
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;

    try {
      setDeletingId(id);
      await api.delete(`/job-offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffers(offers.filter(offer => offer.id !== id));
      toast.success('Offer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete offer');
      console.error('Failed to delete offer:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      company: '',
      search: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ONBOARDING': return 'bg-blue-100 text-blue-800';
      case 'ONBOARDED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const paginatedOffers = filteredOffers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
                    <Plus className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                    Job Offers
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    {filteredOffers.length} {filteredOffers.length === 1 ? 'offer' : 'offers'} found
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <BackButton />
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium ${
                    showFilters || filters.status || filters.company
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-gray-200 text-gray-700 bg-white/70'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {(filters.status || filters.company) && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {[filters.status, filters.company].filter(Boolean).length}
                    </span>
                  )}
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
                placeholder="Search by candidate, job title, or company..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
              />
            </div>

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
                  
                  {/* Company Filter */}
                  <div>
  <h3 className="text-sm font-medium text-gray-700 mb-3">Company</h3>
  <select
    name="company"
    value={filters.company}
    onChange={handleFilterChange}
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  >
    <option value="">All Companies</option>
    {companyOptions.map((company, index) => (
      <option key={index} value={company}>{company}</option>
    ))}
  </select>
</div>
                </div>
                
                {(filters.status || filters.company) && (
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

          {/* Offers Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin h-12 w-12 text-indigo-600" />
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No job offers found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {filters.search || filters.status || filters.company 
                    ? "Try adjusting your search criteria" 
                    : "No job offers have been created yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Date</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {paginatedOffers.map((offer) => (
                          <motion.tr
                            key={offer.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{offer.candidateName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">{offer.jobTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">{offer.company}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(offer.status)}`}>
                                {statusOptions.find(s => s.value === offer.status)?.label || offer.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">₹{offer.salary?.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-600">
                                {new Date(offer.offerDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedOffer(offer)}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="View"
                              >
                                <Eye size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteOffer(offer.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                                disabled={deletingId === offer.id}
                              >
                                {deletingId === offer.id ? (
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
                      <span className="font-medium">{Math.min(page * itemsPerPage, filteredOffers.length)}</span> of{' '}
                      <span className="font-medium">{filteredOffers.length}</span> offers
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

          {/* View Offer Modal */}
          <AnimatePresence>
            {selectedOffer && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Offer Details</h2>
                        <div className="flex items-center space-x-4">
                          <p className="text-indigo-600 font-medium">{selectedOffer.candidateName}</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOffer.status)}`}>
                            {statusOptions.find(s => s.value === selectedOffer.status)?.label || selectedOffer.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedOffer(null)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Candidate Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Job Title</h4>
                            <p className="text-gray-800">{selectedOffer.jobTitle}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
                            <p className="text-gray-800">{selectedOffer.company}</p>
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
                            <p className="text-gray-800">₹{selectedOffer.salary?.toLocaleString()}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Offer Date</h4>
                            <p className="text-gray-800">
                              {new Date(selectedOffer.offerDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedOffer.joiningDate && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-green-600" />
                          Joining Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Joining Date</h4>
                            <p className="text-gray-800">
                              {new Date(selectedOffer.joiningDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedOffer.offerLetterUrl && (
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                          Offer Letter
                        </h3>
                        <a 
                          href={selectedOffer.offerLetterUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          View Offer Letter
                        </a>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedOffer(null)}
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

export default AdminOffers;