import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, Search, User, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import BackButton from '../../../components/BackButton';

const AdminOfficer = () => {
  const [officers, setOfficers] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    department: '',
    contactNumber: '',
    designation: ''
  });
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOfficerId, setCurrentOfficerId] = useState(null);
  const [expandedOfficer, setExpandedOfficer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [officersRes, usersRes] = await Promise.all([
        api.get('/placement-officer', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setOfficers(officersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'userId') {
      const selectedUser = users.find(user => user.id === parseInt(value));
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          email: selectedUser.email
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode) {
        await api.put(`/placement-officer/${currentOfficerId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Officer updated successfully');
      } else {
        await api.post('/placement-officer', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Officer created successfully');
      }
      
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation failed');
    }
    
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this officer?')) return;
    try {
      await api.delete(`/placement-officer/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Officer deleted successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete officer');
    }
  };

  const handleEdit = (officer) => {
    setFormData({
      userId: officer.userId,
      email: officer.email,
      department: officer.department,
      contactNumber: officer.contactNumber,
      designation: officer.designation
    });
    setCurrentOfficerId(officer.id);
    setEditMode(true);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      email: '',
      department: '',
      contactNumber: '',
      designation: ''
    });
    setEditMode(false);
    setCurrentOfficerId(null);
    setShowCreateModal(false);
  };

  const toggleOfficerExpand = (id) => {
    setExpandedOfficer(expandedOfficer === id ? null : id);
  };

  const filteredOfficers = officers.filter(officer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      officer.id.toString().includes(searchLower) ||
      (officer.userId && officer.userId.toString().includes(searchLower)) ||
      (officer.email && officer.email.toLowerCase().includes(searchLower)) ||
      (officer.department && officer.department.toLowerCase().includes(searchLower)) ||
      (officer.contactNumber && officer.contactNumber.includes(searchTerm)) ||
      (officer.designation && officer.designation.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="bg-white text-black">
      <div className="min-h-screen p-4 md:p-6 relative">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-6 shadow-lg">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 md:mb-2">
                  Placement Officers
                </h1>
                <p className="text-gray-600 text-sm md:text-base font-medium">
                  {officers.length} {officers.length === 1 ? 'officer' : 'officers'} registered
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BackButton />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span>Add Officer</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search officers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 outline-none"
            />
          </div>
        </div>

        {/* Officers List - Mobile View */}
        <div className="block md:hidden">
          {filteredOfficers.length === 0 ? (
            <div className="bg-white/80 rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No officers found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search criteria" : "No officers have been registered yet"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Officer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOfficers.map((officer) => (
                <div key={officer.id} className="bg-white/80 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleOfficerExpand(officer.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">ID: {officer.id}</h3>
                        <p className="text-sm text-gray-500">User ID: {officer.userId}</p>
                      </div>
                    </div>
                    {expandedOfficer === officer.id ? (
                      <ChevronUp className="text-gray-400" />
                    ) : (
                      <ChevronDown className="text-gray-400" />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedOfficer === officer.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-gray-800">{officer.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Department</p>
                            <p className="text-gray-800">{officer.department}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="text-gray-800">{officer.contactNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Designation</p>
                            <p className="text-gray-800">{officer.designation}</p>
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(officer);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(officer.id);
                              }}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Officers Table - Desktop View */}
        <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {filteredOfficers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No officers found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm ? "Try adjusting your search criteria" : "No officers have been registered yet"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Officer
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredOfficers.map((officer) => (
                        <motion.tr
                          key={officer.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.userId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.contactNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.designation}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(officer)}
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(officer.id)}
                                className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Create/Edit Officer Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            >
              <motion.div 
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editMode ? 'Edit Officer' : 'Add New Officer'}
                  </h3>
                  <button 
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <select
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                      disabled={editMode}
                    >
                      <option value="">Select Placement Officer</option>
                      {users
                        .filter(user =>
                          user.roles.includes('PLACEMENT_OFFICER') &&
                          (!officers.some(o => o.userId === user.id) || (editMode && user.id === parseInt(formData.userId)))
                        )
                        .map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} (ID: {user.id})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                      }`}
                    >
                      {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update' : 'Create')}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminOfficer;