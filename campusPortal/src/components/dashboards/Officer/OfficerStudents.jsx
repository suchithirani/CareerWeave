import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  User,
  Shield,
  RefreshCw,
  AlertCircle,
  Loader,
  Search,
  Filter,
  X,
  Eye,
  FileText,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Award,
  Calendar,
  Code,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../BackButton';
import Pagination from '../../Pagination';

const OfficerStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    branch: '',
    degree: '',
    passingYear: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewStudent, setViewStudent] = useState(null);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

  const branchOptions = [
    'Computer Science',
    'Electrical',
    'Mechanical',
    'Civil',
    'Electronics',
    'Information Technology'
  ];

  const degreeOptions = [
    'Bachelor',
    'Master',
    'PhD'
  ];

  const yearOptions = Array.from({length: 10}, (_, i) => new Date().getFullYear() + i);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchAllStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://localhost:8080/api/student/profile/officer',
        getAuthConfig()
      );

      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else if (Array.isArray(response.data.students)) {
        setStudents(response.data.students);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error('Error fetching student profiles:', error);
      setError('Failed to load student profiles.');
      toast.error('Failed to load student profiles.');
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
      branch: '',
      degree: '',
      passingYear: ''
    });
    setSearchTerm('');
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      searchTerm === '' ||
      (student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBranch = 
      filters.branch === '' ||
      student.branch === filters.branch;
    
    const matchesDegree = 
      filters.degree === '' ||
      student.degree === filters.degree;
    
    const matchesYear = 
      filters.passingYear === '' ||
      student.passingYear === filters.passingYear;
    
    return matchesSearch && matchesBranch && matchesDegree && matchesYear;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

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
                    <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Student Profiles
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} registered
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchAllStudents}
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
                  placeholder="Search by name, enrollment or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.branch || filters.degree || filters.passingYear
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {(filters.branch || filters.degree || filters.passingYear) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    {[filters.branch, filters.degree, filters.passingYear].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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

                  {/* Passing Year Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Passing Year</h3>
                    <select
                      name="passingYear"
                      value={filters.passingYear}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">Any Year</option>
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(filters.branch || filters.degree || filters.passingYear || searchTerm) && (
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

          {/* Students Table */}
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
            ) : filteredStudents.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <User className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No students found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  {filters.branch || filters.degree || filters.passingYear || searchTerm
                    ? "Try adjusting your search criteria"
                    : "No students have been registered yet"}
                </p>
                {(filters.branch || filters.degree || filters.passingYear || searchTerm) && (
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentItems.map((student) => (
                          <motion.tr
                            key={student.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{student.user?.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{student.user?.email}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.enrollmentNumber}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.branch}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.degree}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {student.cgpa || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.passingYear}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
  <div className="flex justify-start items-center space-x-2">
    {student.resumeLink && (
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href={student.resumeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:text-green-900 p-1 flex items-center"
        title="Download Resume"
      >
        <Download size={16} />
      </motion.a>
    )}
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setViewStudent(student)}
      className="text-indigo-600 hover:text-indigo-900 p-1 flex items-center"
      title="View"
    >
      <Eye size={16} />
    </motion.button>
  </div>
</td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3 p-3">
                  {currentItems.map((student) => (
                    <div key={student.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                      <div 
                        className="p-4 flex justify-between items-center"
                        onClick={() => setViewStudent(student)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{student.user?.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600">{student.enrollmentNumber}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Branch</p>
                            <p className="text-sm">
                              {student.branch}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Degree</p>
                            <p className="text-sm">
                              {student.degree}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">CGPA</p>
                            <p className="text-sm">
                              {student.cgpa || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Year</p>
                            <p className="text-sm">
                              {student.passingYear}
                            </p>
                          </div>
                        </div>
                        {student.resumeLink && (
                          <div className="flex justify-end">
                            <a
                              href={student.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900 text-sm flex items-center"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Resume
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredStudents.length > itemsPerPage && (
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredStudents.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* View Student Modal */}
          <AnimatePresence>
            {viewStudent && (
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewStudent.user?.name}</h2>
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {viewStudent.enrollmentNumber}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewStudent(null)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Personal Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                            <p className="text-gray-800">
                              {viewStudent.user?.email}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Contact</h4>
                            <p className="text-gray-800">
                              {viewStudent.contactNumber || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                          Academic Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Branch</h4>
                            <p className="text-gray-800">
                              {viewStudent.branch}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Degree</h4>
                            <p className="text-gray-800">
                              {viewStudent.degree}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">CGPA</h4>
                            <p className="text-gray-800">
                              {viewStudent.cgpa || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Passing Year</h4>
                            <p className="text-gray-800">
                              {viewStudent.passingYear}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Code className="w-5 h-5 mr-2 text-indigo-600" />
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {viewStudent.skills ? (
                            viewStudent.skills.split(',').map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-800 border border-gray-200">
                                {skill.trim()}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-600">No skills specified</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-green-600" />
                          Resume
                        </h3>
                        {viewStudent.resumeLink ? (
                          <a
                            href={viewStudent.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download Resume
                          </a>
                        ) : (
                          <p className="text-gray-600">No resume uploaded</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-gray-600" />
                        Additional Information
                      </h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {viewStudent.additionalInfo || 'No additional information provided.'}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setViewStudent(null)}
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

export default OfficerStudents;