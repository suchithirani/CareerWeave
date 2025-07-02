import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';
import { 
  Users, 
  User, 
  Shield, 
  Briefcase, 
  GraduationCap, 
  Search, 
  Trash2, 
  Edit, 
  ArrowLeft,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Eye
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  const usersPerPage = 10;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // Filter logic
  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toString().includes(searchTerm)
      );
    }

    if (selectedRole !== 'All') {
  filtered = filtered.filter((user) =>
    Array.isArray(user.roles) 
      ? user.roles.includes(selectedRole)
      : user.roles === selectedRole
  );
}

    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to first page on filter change
  }, [searchTerm, selectedRole, users]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      const res = await api.get(`/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
      setShowUserModal(true);
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  const clearFilters = () => {
    setSelectedRole('All');
    setSearchTerm('');
  };

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadgeColor = (role) => {
  // Handle case where role might be an array
  const roleToCheck = Array.isArray(role) ? role[0] : role;
  
  switch (roleToCheck) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800';
    case 'STUDENT':
      return 'bg-blue-100 text-blue-800';
    case 'COMPANY_HR':
      return 'bg-green-100 text-green-800';
    case 'PLACEMENT_OFFICER':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

  const formatRole = (role) => {
  if (!role) return '-';
  if (Array.isArray(role)) {
    return role.map(r => r.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ');
  }
  return role.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                    User Management
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} registered
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
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="group bg-white hover:bg-blue-50 text-blue-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 border border-blue-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => navigate('/admin/users/create')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
                >
                  <User className="w-5 h-5" />
                  <span>Add User</span>
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
                  placeholder="Search users by name, email or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium ${
                  showFilters || selectedRole !== 'All'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {selectedRole !== 'All' && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">1</span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">User Role</h3>
                    <div className="space-y-2">
                      {['All', 'ADMIN', 'STUDENT', 'COMPANY_HR', 'PLACEMENT_OFFICER'].map(role => (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                            selectedRole === role
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {formatRole(role)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {(selectedRole !== 'All') && (
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

          {/* Users Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="relative">
                  <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
                  <div className="absolute inset-0 w-10 h-10 border-2 border-blue-200 rounded-full animate-ping"></div>
                </div>
                <span className="mt-4 text-gray-600 font-medium">Loading user data...</span>
              </div>
            ) : currentUsers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm || selectedRole !== 'All'
                    ? "Try adjusting your search or filter criteria"
                    : "No users have been registered yet"}
                </p>
                <button
                  onClick={() => navigate('/admin/users/create')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
                >
                  <User className="w-5 h-5 mr-2" />
                  Add New User
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentUsers.map((user) => (
                          <motion.tr
                            key={user.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-8 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(Array.isArray(user.roles) ? user.roles[0] : user.roles)}`}>
    {formatRole(user.roles)}
  </span>
</td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => fetchUserDetails(user.id)}
                                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                                  className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
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
                {filteredUsers.length > usersPerPage && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredUsers.length}
                  itemsPerPage={usersPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
              </>
            )}
          </div>

          {/* User Details Modal */}
          {showUserModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.name}</h2>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(selectedUser.roles)}`}>
                          {formatRole(selectedUser.roles)}
                        </span>
                        <span className="text-gray-600">ID: {selectedUser.id}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                          <p className="text-gray-800">{selectedUser.email}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Account Created</h4>
                          <p className="text-gray-800">
                            {new Date(selectedUser.updatedAt || selectedUser.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Role Information</h3>
                      <div className="space-y-4">
                        <div>
      <h4 className="text-sm font-medium text-gray-500 mb-1">Roles</h4>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(selectedUser.roles) ? (
          selectedUser.roles.map((role, index) => (
            <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}>
              {formatRole(role)}
            </span>
          ))
        ) : (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.roles)}`}>
            {formatRole(selectedUser.roles)}
          </span>
        )}
      </div>
    </div>

                        
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowUserModal(false);
                        navigate(`/admin/users/edit/${selectedUser.id}`);
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md"
                    >
                      Edit User
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

export default AdminUsers;