import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Download,
  RefreshCw,
  User,
  Briefcase,
  Layers,
  BarChart2,
  PieChart as PieChartIcon,
  Filter,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import BackButton from '../../BackButton';
import api from '../../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a29bfe', '#fd79a8'];

const OfficerReportSummary = () => {
  const [summary, setSummary] = useState(null);
  const [companyWise, setCompanyWise] = useState([]);
  const [departmentWise, setDepartmentWise] = useState([]);
  const [studentWise, setStudentWise] = useState([]);
  const [filterYear, setFilterYear] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchReports();
  }, [filterYear, filterBranch]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const summaryRes = await api.get('/reports/summary', { ...getAuthConfig(), params: { year: filterYear, branch: filterBranch } });
      setSummary(summaryRes.data);

      const companyRes = await api.get('/reports/company-wise', { ...getAuthConfig(), params: { year: filterYear, branch: filterBranch } });
      setCompanyWise(Array.isArray(companyRes.data) ? companyRes.data : []);

      const deptRes = await api.get('/reports/department-wise', { ...getAuthConfig(), params: { year: filterYear, branch: filterBranch } });
      setDepartmentWise(Array.isArray(deptRes.data) ? deptRes.data : []);

      const studentRes = await api.get('/reports/student-wise', { ...getAuthConfig(), params: { year: filterYear, branch: filterBranch } });
      setStudentWise(Array.isArray(studentRes.data) ? studentRes.data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Placement Report Summary', 14, 22);

    if (summary) {
      doc.setFontSize(12);
      doc.text(`Total Students: ${summary.totalStudents}`, 14, 32);
      doc.text(`Students Placed: ${summary.placedStudents}`, 14, 40);
      doc.text(`Average CTC: ₹${summary.averageCTC?.toFixed(2)}`, 14, 48);
    }

    autoTable(doc, {
      startY: 55,
      head: [['Company', 'Total Offers', 'Avg CTC (₹)']],
      body: companyWise.map(c => [c.companyName, c.totalHires, c.averageCTC?.toFixed(2)]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Branch', 'Total Students', 'Placed', 'Avg CTC (₹)']],
      body: departmentWise.map(d => [d.department, d.totalStudents, d.placedStudents, d.averageCTC?.toFixed(2)]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Name', 'Branch', 'Status', 'Company', 'CTC (₹)']],
      body: studentWise.map(s => [s.name, s.branch, s.placed ? 'Placed' : 'Not Placed', s.companyName || '-', s.salary?.toFixed(2)]),
    });

    doc.save('PlacementReportSummary.pdf');
  };

  const branchOptions = [
    'CSE',
    'IT',
    'ECE',
    'EE',
    'ME',
    'CE',
    'CHEMICAL'
  ];

  const yearOptions = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);

  // Pagination logic for student-wise table
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudentItems = studentWise.slice(indexOfFirstItem, indexOfLastItem);

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
                    <BarChart2 className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Briefcase className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Placement Reports
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    Comprehensive placement statistics and analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchReports}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                showFilters || filterYear || filterBranch
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-700 bg-white/70'
              }`}
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              Filters
              {(filterYear || filterBranch) && (
                <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  {[filterYear, filterBranch].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Year Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Year</h3>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">All Years</option>
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Branch Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Branch</h3>
                    <select
                      value={filterBranch}
                      onChange={(e) => setFilterBranch(e.target.value)}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">All Branches</option>
                      {branchOptions.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(filterYear || filterBranch) && (
                  <button
                    onClick={() => {
                      setFilterYear('');
                      setFilterBranch('');
                    }}
                    className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Total Students</h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{summary.totalStudents}</p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Students Placed</h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{summary.placedStudents}</p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Average CTC</h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{summary.averageCTC?.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* Charts Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  Placement Analytics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-700 mb-3">Placement Status</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={[
                              { name: 'Placed', value: summary?.placedStudents || 0 },
                              { name: 'Not Placed', value: (summary?.totalStudents || 0) - (summary?.placedStudents || 0) }
                            ]} 
                            dataKey="value" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={80} 
                            label
                          >
                            {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} students`, '']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-700 mb-3">Department-Wise Placement</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentWise}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="department" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} students`, '']} />
                          <Legend />
                          <Bar dataKey="placedStudents" fill="#00C49F" name="Placed" />
                          <Bar dataKey="totalStudents" fill="#FF8042" name="Total Students" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company-wise Table */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                  Company-Wise Placement
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Offers</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg CTC (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companyWise.map((company, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.companyName}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.totalHires}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.averageCTC?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Department-wise Table */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                  Department-Wise Placement
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placed</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg CTC (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departmentWise.map((dept, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.totalStudents}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.placedStudents}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.averageCTC?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student-wise Table */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  Student-Wise Placement
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTC (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentStudentItems.map((student, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.branch}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              student.placed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {student.placed ? 'Placed' : 'Not Placed'}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.companyName || '-'}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.salary?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {studentWise.length > itemsPerPage && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={studentWise.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerReportSummary;