import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  User, 
  FileText,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  ArrowLeft,
  Filter
} from 'lucide-react';
import BackButton from '../../../components/BackButton';

const AdminStudentProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10;
  const [showFilters, setShowFilters] = useState(false);
const [selectedBranch, setSelectedBranch] = useState('All');
const [selectedDegree, setSelectedDegree] = useState('All');
const [cgpaRange, setCgpaRange] = useState([0, 10]);
  const navigate = useNavigate();

  // Add this outside your component

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/student/profile/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfiles(res.data);
        setFilteredProfiles(res.data);
      } catch (err) {
        toast.error('Failed to fetch student profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
  let filtered = [...profiles];

  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cgpa?.toString().includes(searchTerm) ||
      p.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Branch filter
  if (selectedBranch !== 'All') {
    filtered = filtered.filter(p => p.branch === selectedBranch);
  }

  // Degree filter
  if (selectedDegree !== 'All') {
    filtered = filtered.filter(p => p.degree === selectedDegree);
  }

  // CGPA range filter
  filtered = filtered.filter(p => p.cgpa >= cgpaRange[0] && p.cgpa <= cgpaRange[1]);

  setFilteredProfiles(filtered);
  setCurrentPage(1);
}, [searchTerm, selectedBranch, selectedDegree, cgpaRange, profiles]);

  const handleDeleteProfile = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this student profile?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/student/profile/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = profiles.filter(p => p.user?.id !== userId);
      setProfiles(updated);
      setFilteredProfiles(updated);
      toast.success('Student profile deleted successfully');
    } catch (error) {
      toast.error(error.response?.status === 403
        ? 'Access Denied: Only admins can delete student profiles.'
        : 'Failed to delete student profile');
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchTerm(val);
    const filtered = profiles.filter(p =>
      p.user?.name?.toLowerCase().includes(val) ||
      p.branch?.toLowerCase().includes(val) ||
      p.cgpa?.toString().includes(val) ||
      p.enrollmentNumber?.toLowerCase().includes(val)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * profilesPerPage;
  const indexOfFirst = indexOfLast - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  const closeModal = () => setSelectedProfile(null);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">Loading student profiles...</h2>
        </motion.div>
      </div>
    );
  }

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
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                    Student Profiles
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'} registered
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <BackButton/>
                
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name, enrollment, branch or CGPA..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
              />
            </div>
          </div>

          {/* Add this after your search input section */}
<button
  onClick={() => setShowFilters(!showFilters)}
  className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium mb-7 ${
    showFilters || selectedBranch !== 'All' || selectedDegree !== 'All' || cgpaRange[0] !== 0 || cgpaRange[1] !== 10
      ? 'bg-blue-50 border-blue-200 text-blue-700'
      : 'border-gray-200 text-gray-700 bg-white/70'
  }`}
>
  <Filter className="w-5 h-5" />
  Filters
  {(selectedBranch !== 'All' || selectedDegree !== 'All' || cgpaRange[0] !== 0 || cgpaRange[1] !== 10) && (
    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
      {[selectedBranch !== 'All', selectedDegree !== 'All', cgpaRange[0] !== 0, cgpaRange[1] !== 10].filter(Boolean).length}
    </span>
  )}
</button>

{/* Expanded Filters */}
{showFilters && (
  <div className="mt-6 pt-6 border-t border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Branch Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Branch</h3>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full border border-gray-300 mb- rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="All">All Branches</option>
          {[...new Set(profiles.map(p => p.branch))].map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {/* Degree Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Degree</h3>
        <select
          value={selectedDegree}
          onChange={(e) => setSelectedDegree(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="All">All Degrees</option>
          {[...new Set(profiles.map(p => p.degree))].map(degree => (
            <option key={degree} value={degree}>{degree}</option>
          ))}
        </select>
      </div>

      {/* CGPA Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">CGPA Range</h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={cgpaRange[0]}
            onChange={(e) => setCgpaRange([parseFloat(e.target.value), cgpaRange[1]])}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <span>to</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={cgpaRange[1]}
            onChange={(e) => setCgpaRange([cgpaRange[0], parseFloat(e.target.value)])}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>

    {(selectedBranch !== 'All' || selectedDegree !== 'All' || cgpaRange[0] !== 0 || cgpaRange[1] !== 10) && (
      <button
        onClick={() => {
          setSelectedBranch('All');
          setSelectedDegree('All');
          setCgpaRange([0, 10]);
        }}
        className="mt-6 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        <X className="w-4 h-4" />
        Clear all filters
      </button>
    )}
  </div>
)}

          {/* Profiles Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {currentProfiles.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No student profiles found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm ? "Try adjusting your search criteria" : "No student profiles have been registered yet"}
                </p>
                <button
                  onClick={() => navigate('/admin/students/create')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
                >
                  <User className="w-5 h-5 mr-2" />
                  Add New Student
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        {['Enrollment', 'Name', 'Branch', 'Degree', 'CGPA', 'Year', 'Skills', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentProfiles.map((profile) => (
                          <motion.tr
                            key={profile.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {profile.enrollmentNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                                  {profile.user?.name ? (
                                    <span className="text-blue-600 font-medium">
                                      {profile.user.name.charAt(0).toUpperCase()}
                                    </span>
                                  ) : (
                                    <User className="w-5 h-5 text-blue-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{profile.user?.name || 'N/A'}</div>
                                  <div className="text-xs text-gray-500">{profile.user?.email || ''}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {profile.branch}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {profile.degree}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                profile.cgpa >= 8 ? 'bg-green-100 text-green-800' : 
                                profile.cgpa >= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {profile.cgpa}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {profile.passingYear}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">
                              {profile.skills}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setSelectedProfile(profile)}
                                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProfile(profile.user.id)}
                                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredProfiles.length > profilesPerPage && (
                  <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-700 mb-4 md:mb-0">
                      Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLast, filteredProfiles.length)}</span> of{' '}
                      <span className="font-medium">{filteredProfiles.length}</span> profiles
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
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
                            onClick={() => paginate(pageNum)}
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
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
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

          {/* Profile Details Modal */}
          {selectedProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProfile.user?.name || 'Student Profile'}</h2>
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {selectedProfile.branch}
                        </span>
                        <span className="text-gray-600">Enrollment: {selectedProfile.enrollmentNumber}</span>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                          <p className="text-gray-800">{selectedProfile.user?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Degree</h4>
                          <p className="text-gray-800">{selectedProfile.degree}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Passing Year</h4>
                          <p className="text-gray-800">{selectedProfile.passingYear}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                        Academic Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">CGPA</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            selectedProfile.cgpa >= 8 ? 'bg-green-100 text-green-800' : 
                            selectedProfile.cgpa >= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedProfile.cgpa}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProfile.skills?.split(',').map((skill, i) => (
                              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                      Career Documents
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Resume</h4>
                        {selectedProfile.resumeLink ? (
                          <a
                            href={selectedProfile.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Resume
                          </a>
                        ) : (
                          <p className="text-gray-500">No resume uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
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

export default AdminStudentProfile;