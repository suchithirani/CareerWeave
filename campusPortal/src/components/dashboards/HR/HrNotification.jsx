import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiPlus, 
  FiMail,
  FiBell,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar
} from 'react-icons/fi';
import BackButton from '../../../components/BackButton';

const HrNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ readStatus: '' });
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, userId: '', title: '', message: '' });
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem('token');
  const API_BASE = 'http://localhost:8080/api/notifications';
  const USERS_API = 'http://localhost:8080/api/notifications/company-students';

  const getAuthConfig = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
  
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/hr`, getAuthConfig());
      console.log(res.data)
      setNotifications(res.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API, getAuthConfig());
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        if (!form.userId) {
    toast.error('Please select a recipient');
    return;
  }
  
  if (!form.title.trim()) {
    toast.error('Title is required');
    return;
  }

  if (!form.message.trim()) {
    toast.error('Message is required');
    return;
  }
        await axios.put(`${API_BASE}/${form.id}`, form, getAuthConfig());
        toast.success('Notification updated successfully');
      } else {
        await axios.post(API_BASE, form, getAuthConfig());
        toast.success('Notification sent successfully');
      }
      setForm({ id: null, userId: '', title: '', message: '' });
      setShowForm(false);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to submit notification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, getAuthConfig());
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleEdit = (notification) => {
    setForm({
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
    });
    setShowForm(true);
  };

  const toggleNotificationExpand = (id) => {
    setExpandedNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setFilters({ readStatus: '' });
    setSearchTerm('');
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchTerm === '' ||
      notification.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesReadStatus =
      filters.readStatus === '' ||
      (filters.readStatus === 'read' && notification.readStatus) ||
      (filters.readStatus === 'unread' && !notification.readStatus);

    return matchesSearch && matchesReadStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 sm:p-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                    <FiBell className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiMail className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Notifications Management
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    Manage and track all notifications
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setForm({ id: null, userId: '', title: '', message: '' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold ${
                    showForm
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  {showForm ? 'Cancel' : 'New Notification'}
                </button>
                <button
                  onClick={fetchNotifications}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search notifications by title, message or recipient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || filters.readStatus
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {filters.readStatus && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Read Status Filter */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Status</h3>
                    <select
                      name="readStatus"
                      value={filters.readStatus}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                    >
                      <option value="">All Statuses</option>
                      <option value="read">Read</option>
                      <option value="unread">Unread</option>
                    </select>
                  </div>
                </div>
                
                {(filters.readStatus || searchTerm) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {form.id ? 'Edit Notification' : 'Create New Notification'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setForm({ id: null, userId: '', title: '', message: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 sm:p-5">
                  <h4 className="text-sm sm:text-base font-medium text-blue-800 mb-2 sm:mb-3 flex items-center gap-2">
                    <FiInfo className="w-4 h-4" />
                    Recipient Selection
                  </h4>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Select Recipient
                    </label>
                    <select
                      name="userId"
                      value={form.userId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    >
                      <option value="">Select Recipient</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter notification title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      placeholder="Enter notification message"
                      value={form.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setForm({ id: null, userId: '', title: '', message: '' });
                    }}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                  >
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                  >
                    {form.id ? (
                      <>
                        <FiSave className="w-4 h-4 sm:w-5 sm:h-5" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Send Notification
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FiBell className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                No Notifications Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filters.readStatus
                  ? 'Try adjusting your search or filter criteria'
                  : 'You currently have no notifications. Create a new one to get started.'}
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  resetFilters();
                  setSearchTerm('');
                }}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create New Notification
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/70 overflow-hidden transition-all duration-300 ${
                    expandedNotifications[notification.id] ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div 
                    className={`p-4 sm:p-6 cursor-pointer ${
                      expandedNotifications[notification.id] 
                        ? 'border-b border-gray-200' 
                        : ''
                    }`}
                    onClick={() => toggleNotificationExpand(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Replace this section in your notification card header */}
<div className="flex items-center gap-3 mb-2">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
    {notification.title}
  </h3>
  {notification.senderName && (
    <span className="text-sm text-gray-500">
      From: {notification.senderName}
    </span>
  )}
</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm sm:text-base">
                          <div className="flex items-center text-gray-600">
                            <FiUser className="mr-2 flex-shrink-0" />
                            <span className="truncate">{notification.userName || 'No recipient'}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            {notification.readStatus ? (
                              <FiCheckCircle className="mr-2 flex-shrink-0 text-green-500" />
                            ) : (
                              <FiAlertCircle className="mr-2 flex-shrink-0 text-red-500" />
                            )}
                            <span>{notification.readStatus ? 'Read' : 'Unread'}</span>
                          </div>
                          
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {expandedNotifications[notification.id] ? (
                          <FiChevronUp className="text-gray-400" />
                        ) : (
                          <FiChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedNotifications[notification.id] && (
                    <div className="p-4 sm:p-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                            Message
                          </h4>
                          <p className="text-sm sm:text-base whitespace-pre-wrap">
                            {notification.message || 'No message content'}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                              Sender
                            </h4>
                            <p className="text-sm sm:text-base">
                              {notification.senderName || 'System'}
                            </p>
                          </div>
                          
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 sm:gap-3">
                        <button
                          onClick={() => handleEdit(notification)}
                          className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                        >
                          <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-lg sm:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                        >
                          <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrNotification;