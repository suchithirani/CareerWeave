import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  MessageSquare,
  ChevronLeft,
  Plus,
  Clock,
  AlertCircle,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../../components/BackButton';

const API_BASE = 'http://localhost:8080/api/feedback';
const token = localStorage.getItem('token');

const HrFeedback = () => {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(res.data);
    } catch (err) {
      toast.error('Error fetching your feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Feedback submitted successfully');
      setForm({ subject: '', message: '' });
      setShowForm(false);
      fetchFeedbacks();
    } catch (err) {
      toast.error('Error submitting feedback');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="order-1 sm:order-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span className="block sm:inline">HR</span>{' '}
              <span className="block sm:inline">Feedback</span>
            </h1>
            <p className="text-gray-600 mt-1">Share your thoughts with HR</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-none">
            <BackButton className="flex-1 sm:flex-none justify-center sm:justify-start" />
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Feedback</span>
              <span className="sm:hidden">Feedback</span>
            </button>
          </div>
        </div>

        {/* Feedback Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden mb-8"
            >
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Feedback subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    placeholder="Your detailed feedback..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Submitted Feedback
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No feedback submitted yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setExpandedFeedback(expandedFeedback === fb.id ? null : fb.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{fb.subject}</h3>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedFeedback === fb.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2"
                        >
                          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                            {fb.message}
                          </div>
                          {fb.response && (
                            <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-r">
                              <p className="text-sm font-medium text-green-800">Admin Response:</p>
                              <p className="text-sm text-green-700 mt-1 whitespace-pre-wrap">
                                {fb.response}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrFeedback;