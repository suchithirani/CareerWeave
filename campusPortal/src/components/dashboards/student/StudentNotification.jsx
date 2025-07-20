import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Bell,
  CheckCircle,
  Mail,
  User,
  Clock,
  Send,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import BackButton from '../../BackButton';

const StudentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const token = localStorage.getItem('token');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('id');
      const res = await axios.get(
        `http://localhost:8080/api/notifications/user/${userId}`,
        getAuthConfig()
      );
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load notifications. Please try again.');
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/${id}/read`,
        {},
        getAuthConfig()
      );
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, readStatus: true } : n))
      );
      toast.success('Marked as read');
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        'http://localhost:8080/api/notifications/mark-all-read',
        {},
        getAuthConfig()
      );
      setNotifications(prev =>
        prev.map(n => ({ ...n, readStatus: true }))
      );
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('Failed to mark all as read');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnread = showUnreadOnly ? !n.readStatus : true;
    return matchesSearch && matchesUnread;
  });

  const unreadCount = notifications.filter(n => !n.readStatus).length;

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
                    <Bell className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    My Notifications
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'} found
                    {unreadCount > 0 && (
                      <span className="ml-2 text-red-600">({unreadCount} unread)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                  <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchNotifications}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Refresh</span>
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Mark All as Read</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border font-medium text-sm sm:text-base ${
                  showFilters || showUnreadOnly
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-700 bg-white/70'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
                {showUnreadOnly && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">1</span>
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Show Unread Only
                  </label>
                </div>
                
                {(showUnreadOnly) && (
                  <button
                    onClick={() => {
                      setShowUnreadOnly(false);
                    }}
                    className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notification List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <AlertCircle className="w-6 h-6 sm:w-10 sm:h-10 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Error loading notifications</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                {error}
              </p>
              <button
                onClick={fetchNotifications}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Bell className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No notifications found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                {showUnreadOnly || searchTerm
                  ? "Try adjusting your search criteria"
                  : "You don't have any notifications yet"}
              </p>
              {(showUnreadOnly || searchTerm) && (
                <button
                  onClick={() => {
                    setShowUnreadOnly(false);
                    setSearchTerm('');
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`border rounded-xl p-4 sm:p-6 shadow-sm transition ${
                        notif.readStatus ? 'bg-gray-50' : 'bg-white border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            {!notif.readStatus && (
                              <span className="w-2 h-2 mt-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                            )}
                            <div>
                              <h3 className={`text-lg sm:text-xl font-semibold ${
                                notif.readStatus ? 'text-gray-800' : 'text-blue-700'
                              }`}>
                                {notif.title}
                              </h3>
                              <p className="text-sm sm:text-base text-gray-700 mt-1">{notif.message}</p>
                              <div className="mt-3 space-y-1">
                                {notif.senderName && (
                                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>From: <span className="font-medium">{notif.senderName}</span></span>
                                  </p>
                                )}
                                {notif.createdAt && (
                                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{format(new Date(notif.createdAt), 'PPPpp')}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {!notif.readStatus && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markAsRead(notif.id)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm sm:text-base"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Mark as Read</span>
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotification;