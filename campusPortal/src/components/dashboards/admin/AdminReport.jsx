import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import BackButton from '../../../components/BackButton';
import { 
  Users, 
  Briefcase, 
  BarChart2,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Eye,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  PieChart,
  Building,
  GraduationCap,
  DollarSign,
  Search
} from 'lucide-react';

const AdminReport = () => {
  const [summary, setSummary] = useState(null);
  const [companyReport, setCompanyReport] = useState([]);
  const [departmentReport, setDepartmentReport] = useState([]);
  const [studentReport, setStudentReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const reportsPerPage = 10;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const [summaryRes, companyRes, deptRes, studentRes] = await Promise.all([
          api.get('/reports/summary', { headers }),
          api.get('/reports/company-wise', { headers }),
          api.get('/reports/department-wise', { headers }),
          api.get('/reports/student-wise', { headers }),
        ]);

        setSummary(summaryRes.data);
        setCompanyReport(companyRes.data);
        setDepartmentReport(deptRes.data);
        setStudentReport(studentRes.data);
      } catch (err) {
        setError('Failed to load reports');
        toast.error('Failed to fetch reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  // Filter student report
  const filteredStudentReport = studentReport.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentStudents = filteredStudentReport.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudentReport.length / reportsPerPage);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹');
  };

  const getPlacementRateColor = (rate) => {
    if (rate >= 80) return 'bg-green-100 text-green-800';
    if (rate >= 50) return 'bg-blue-100 text-blue-800';
    if (rate >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <BarChart2 className="w-12 h-12 animate-pulse text-blue-500" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 rounded-full animate-ping"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-8" role="alert">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

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
                    <BarChart2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                    Placement Analytics
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    Comprehensive reports and statistics
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
                <BackButton />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3">
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setCurrentTab('summary')}
              className={`px-6 py-3 font-medium text-sm flex items-center ${currentTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <PieChart className="w-4 h-4 mr-2" />
              Summary
            </button>
            <button
              onClick={() => setCurrentTab('companies')}
              className={`px-6 py-3 font-medium text-sm flex items-center ${currentTab === 'companies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Building className="w-4 h-4 mr-2" />
              Company-wise
            </button>
            <button
              onClick={() => setCurrentTab('departments')}
              className={`px-6 py-3 font-medium text-sm flex items-center ${currentTab === 'departments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Department-wise
            </button>
            <button
              onClick={() => setCurrentTab('students')}
              className={`px-6 py-3 font-medium text-sm flex items-center ${currentTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Student-wise
            </button>
          </div>

          {/* Search and Filter Section (for student report) */}
          {currentTab === 'students' && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students by name, company, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-gray-800"
                  />
                </div>
                
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {currentTab === 'summary' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Placement Summary</h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Total Students</h3>
                        <p className="text-3xl font-bold text-gray-900">{summary.totalStudents}</p>
                      </div>
                      <Users className="w-10 h-10 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Placed Students</h3>
                        <p className="text-3xl font-bold text-gray-900">{summary.placedStudents}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {((summary.placedStudents / summary.totalStudents) * 100).toFixed(1)}% placement rate
                        </p>
                      </div>
                      <Award className="w-10 h-10 text-green-400" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Average CTC</h3>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary.averageCTC)}</p>
                        <p className="text-sm text-gray-600 mt-1">Annual package</p>
                      </div>
                      <DollarSign className="w-10 h-10 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Hiring Companies</h3>
                    <div className="space-y-4">
                      {companyReport.slice(0, 5).map((company, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <Briefcase className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-800">{company.companyName}</span>
                          </div>
                          <span className="text-gray-700">{company.totalHires} hires</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
                    <div className="space-y-4">
                      {departmentReport.slice(0, 5).map((dept, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{dept.department}</span>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlacementRateColor((dept.placedStudents / dept.totalStudents) * 100)}`}>
                              {((dept.placedStudents / dept.totalStudents) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'companies' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Company-wise Placement Statistics</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hires</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average CTC</th>
                        
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companyReport.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                                <Building className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="font-medium text-gray-900">{row.companyName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {row.totalHires}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {formatCurrency(row.averageCTC)}
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentTab === 'departments' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Department-wise Placement Statistics</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placed Students</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement Rate</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average CTC</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departmentReport.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-4 whitespace-nowrap font-medium text-gray-900">
                            {row.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {row.totalStudents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {row.placedStudents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlacementRateColor((row.placedStudents / row.totalStudents) * 100)}`}>
                              {((row.placedStudents / row.totalStudents) * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {formatCurrency(row.averageCTC)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentTab === 'students' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Student-wise Placement Details</h2>
                {filteredStudentReport.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No students found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {searchTerm ? "Try adjusting your search criteria" : "No student data available"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                          <tr>
                            <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentStudents.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-4 whitespace-nowrap font-medium text-gray-900">
                                {row.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {row.branch}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {row.companyName || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {row.salary ? formatCurrency(row.salary) : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.placed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {row.placed ? 'Placed' : 'Not Placed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {filteredStudentReport.length > reportsPerPage && (
                      <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between bg-gray-50">
                        <div className="text-sm text-gray-700 mb-4 md:mb-0">
                          Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(indexOfLast, filteredStudentReport.length)}</span> of{' '}
                          <span className="font-medium">{filteredStudentReport.length}</span> students
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;