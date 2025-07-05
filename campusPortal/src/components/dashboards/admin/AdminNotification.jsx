import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { 
  FiMail, 
  FiSend, 
  FiCheck, 
  FiTrash2, 
  FiRefreshCw,
  FiSearch,
  FiAlertCircle,
  FiClock,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiFilter,
  FiPlus,
  FiChevronDown
} from "react-icons/fi";
import { format } from "date-fns";
import BackButton from "../../../components/BackButton";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminNotification = () => {
  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [newNotification, setNewNotification] = useState({
    userId: "",
    title: "",
    message: "",
  });

  const notificationsPerPage = 10;
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchAllNotifications();
  }, []);

  // Fetch All Notifications
  const fetchAllNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("notifications");
      setNotifications(res.data);
      toast.success("Notifications loaded");
    } catch (err) {
      toast.error("Failed to fetch notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch By User
  const fetchNotificationsByUser = async () => {
    if (!userId) return toast.warning("Please enter a User ID");
    setLoading(true);
    try {
      const res = await api.get(`notifications/user/${userId}`);
      setNotifications(res.data);
      toast.success("User notifications loaded");
    } catch (err) {
      toast.error("Error fetching user's notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create Notification
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("notifications", newNotification);
      toast.success("Notification sent successfully");
      setNewNotification({ userId: "", title: "", message: "" });
      setShowCreateModal(false);
      if (userId === newNotification.userId) fetchNotificationsByUser();
      else fetchAllNotifications();
    } catch (err) {
      toast.error("Failed to send notification");
      console.error(err);
    }
  };

  // Mark As Read
  const markAsRead = async (id) => {
    try {
      await api.put(`notifications/${id}/read`);
      toast.info("Notification marked as read");
      userId ? fetchNotificationsByUser() : fetchAllNotifications();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  // Delete Notification
  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.delete(`notifications/${id}`);
      toast.success("Notification deleted");
      userId ? fetchNotificationsByUser() : fetchAllNotifications();
    } catch (err) {
      toast.error("Failed to delete notification");
      console.error(err);
    }
  };

  // Filtered Notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.readStatus;
    if (filter === "READ") return n.readStatus;
    return true;
  }).filter(n => {
    if (!searchTerm) return true;
    return (
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.userId && n.userId.toString().includes(searchTerm)) ||
      (n.user?.id && n.user.id.toString().includes(searchTerm))
    );
  });

  // Pagination
  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

  const clearFilters = () => {
    setFilter("ALL");
    setSearchTerm("");
    setUserId("");
    fetchAllNotifications();
  };

  const toggleNotificationExpand = (id) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  return (
    <div className="bg-white text-black">
      <div className="min-h-screen p-4 md:p-6 relative">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-6 shadow-lg">
                  <FiMail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-3 h-3 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 md:mb-2">
                  Notifications Management
                </h1>
                <p className="text-gray-600 text-sm md:text-base font-medium">
                  {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'} found
                </p>
                <div className="flex items-center mt-1 text-xs md:text-sm text-gray-500">
                  <FiClock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span>Last updated: {format(new Date(), "MMM dd, yyyy HH:mm")}</span>
                </div>
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
                <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                <span>New Notification</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg border font-medium ${
                showFilters || filter !== "ALL" || userId
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-700 bg-white/70'
              }`}
            >
              <FiFilter className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:inline">Filters</span>
              {(filter !== "ALL" || userId) && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {[filter !== "ALL" ? 1 : 0, userId ? 1 : 0].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <div className="space-y-2">
                    {["ALL", "READ", "UNREAD"].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs md:text-sm ${
                          filter === status
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {status === "ALL" ? "All Notifications" : 
                         status === "READ" ? "Read Only" : "Unread Only"}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-2">User Filter</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Enter User ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                    />
                    <button
                      onClick={fetchNotificationsByUser}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs md:text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              
              {(filter !== "ALL" || userId) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 flex items-center gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FiX className="w-3 h-3 md:w-4 md:h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notifications List - Mobile View */}
        <div className="block md:hidden">
          {loading ? (
            <div className="bg-white/80 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center">
              <div className="relative">
                <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-ping"></div>
              </div>
              <span className="mt-4 text-gray-600 font-medium">Loading notifications...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white/80 rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search criteria" : "No notifications have been created yet"}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                New Notification
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentNotifications.map((notification) => (
                <div key={notification.id} className="bg-white/80 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleNotificationExpand(notification.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        notification.readStatus 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        <FiMail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-xs text-gray-500">
                          {format(new Date(notification.createdAt), "MMM dd, HH:mm")}
                        </p>
                      </div>
                    </div>
                    {expandedNotification === notification.id ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedNotification === notification.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">Message</p>
                            <p className="text-gray-800">{notification.message}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Recipient</p>
                            <p className="text-gray-800">
                              {notification.user?.id ? `User #${notification.user.id}` : 'System'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              notification.readStatus 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {notification.readStatus ? 'Read' : 'Unread'}
                            </p>
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            {!notification.readStatus && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Mark as Read"
                              >
                                <FiCheck size={18} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
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

        {/* Notifications Table - Desktop View */}
        <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="relative">
                <FiRefreshCw className="w-10 h-10 animate-spin text-blue-500" />
                <div className="absolute inset-0 w-10 h-10 border-2 border-blue-200 rounded-full animate-ping"></div>
              </div>
              <span className="mt-4 text-gray-600 font-medium">Loading notifications...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMail className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm ? "Try adjusting your search criteria" : "No notifications have been created yet"}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                New Notification
              </motion.button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notification</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {currentNotifications.map((notification) => (
                        <motion.tr
                          key={notification.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${
                                notification.readStatus 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                <FiMail className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{notification.title}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {notification.message.length > 50 
                                    ? `${notification.message.substring(0, 50)}...` 
                                    : notification.message}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {notification.user?.id ? `User #${notification.user.id}` : 'System'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              notification.readStatus 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {notification.readStatus ? 'Read' : 'Unread'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(notification.createdAt), "MMM dd, yyyy HH:mm")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {!notification.readStatus && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="Mark as Read"
                                >
                                  <FiCheck size={18} />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredNotifications.length > notificationsPerPage && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between bg-gray-50">
                  <div className="text-sm text-gray-700 mb-4 md:mb-0">
                    Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLast, filteredNotifications.length)}</span> of{' '}
                    <span className="font-medium">{filteredNotifications.length}</span> notifications
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </motion.button>
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
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                              : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Notification Modal */}
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
                    Create New Notification
                  </h3>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      type="number"
                      placeholder="Enter User ID (leave empty for system notification)"
                      value={newNotification.userId}
                      onChange={(e) => setNewNotification({ ...newNotification, userId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Notification Title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      placeholder="Notification Message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <FiSend className="inline mr-2" />
                      Send Notification
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

export default AdminNotification;