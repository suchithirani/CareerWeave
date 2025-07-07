import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiUser, 
  FiMapPin, 
  FiClock, 
  FiPlus,
  FiX,
  FiRefreshCw,
  FiLoader
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../../../components/BackButton";

const statusOptions = [
  { value: "Scheduled", label: "Scheduled", color: "blue" },
  { value: "Completed", label: "Completed", color: "purple" },
  { value: "Selected", label: "Selected", color: "green" },
  { value: "Cancelled", label: "Cancelled", color: "red" }
];

const HrInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [jobOpeningsMap, setJobOpeningsMap] = useState({});
  const [jobApplications, setJobApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const [form, setForm] = useState({
    interviewDateTime: "",
    interviewerName: "",
    location: "",
    status: "Scheduled",
    feedback: "",
    jobApplicationId: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [interviewsRes, applicationsRes, studentsRes, jobsRes] = await Promise.all([
        api.get("/interview-schedules/hr"),
        api.get("/job-applications/hr"),
        api.get("/student/profile/admin/all"),
        api.get("/job-openings")
      ]);
      console.log(interviewsRes)

      setInterviews(interviewsRes.data);
      setJobApplications(applicationsRes.data);

      const students = {};
      studentsRes.data.forEach((student) => {
        students[student.id] = student.user?.name || "Unknown";
      });
      setStudentsMap(students);

      const jobs = {};
      jobsRes.data.forEach((job) => {
        jobs[job.id] = job.title || "Unknown Job";
      });
      setJobOpeningsMap(jobs);

    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/interview-schedules/${editingId}`, form);
        toast.success("Interview updated successfully");
      } else {
        await api.post("/interview-schedules", form);
        toast.success("Interview scheduled successfully");
      }
      await fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit interview");
    }
  };

  const resetForm = () => {
    setForm({
      interviewDateTime: "",
      interviewerName: "",
      location: "",
      status: "Scheduled",
      feedback: "",
      jobApplicationId: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (interview) => {
    setForm({
      interviewDateTime: interview.interviewDateTime?.slice(0, 16),
      interviewerName: interview.interviewerName || "",
      location: interview.location || "",
      status: interview.status || "Scheduled",
      feedback: interview.feedback || "",
      jobApplicationId: interview.jobApplicationId || ""
    });
    setEditingId(interview.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) return;
    
    try {
      await api.delete(`/interview-schedules/${id}`);
      toast.success("Interview deleted successfully");
      setInterviews((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  if (initialLoad) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 rounded-full animate-ping"></div>
        </div>
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
                    <FiCalendar className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Interview Management
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {interviews.length} interviews scheduled
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchData}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interview Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {editingId ? "Edit Interview" : "Schedule New Interview"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Student & Job</label>
                    <select
                      required
                      value={form.jobApplicationId}
                      onChange={(e) => setForm({ ...form, jobApplicationId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                    >
                      <option value="">Select Student & Job</option>
                      {jobApplications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {studentsMap[app.studentId] || "Unknown"} - {jobOpeningsMap[app.jobOpeningId] || "Unknown Job"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        value={form.interviewDateTime}
                        onChange={(e) => setForm({ ...form, interviewDateTime: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Interviewer Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Interviewer Name"
                        value={form.interviewerName}
                        onChange={(e) => setForm({ ...form, interviewerName: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Feedback</label>
                    <textarea
                      placeholder="Enter feedback here..."
                      value={form.feedback}
                      onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                    />
                  </div>

                  <div className="flex justify-end gap-3 md:col-span-2 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
                    >
                      {editingId ? "Update Interview" : "Schedule Interview"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interviews Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <FiLoader className="animate-spin h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" />
              </div>
            ) : interviews.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <FiCalendar className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No interviews scheduled yet</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                  Click the "Schedule" button to create a new interview
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 inline-flex items-center text-sm sm:text-base"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Schedule Interview
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {interviews.map((interview) => (
                        <tr key={interview.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FiUser className="text-indigo-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{interview.candidateName || "Unknown"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{interview.jobTitle || "Unknown"}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiClock className="text-gray-400 mr-2" />
                              <div className="text-sm text-gray-900">
                                {new Date(interview.interviewDateTime).toLocaleString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {interview.interviewerName || "-"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusOptions.find(s => s.value === interview.status)?.color 
                                ? `bg-${statusOptions.find(s => s.value === interview.status).color}-100 text-${statusOptions.find(s => s.value === interview.status).color}-800`
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {interview.status || "-"}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(interview)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              >
                                <FiEdit className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(interview.id)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <FiTrash2 className="mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3 p-3">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{interview.candidateName || "Unknown"}</h3>
                            <p className="text-sm text-gray-600 mt-1">{interview.jobTitle || "Unknown"}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusOptions.find(s => s.value === interview.status)?.color 
                              ? `bg-${statusOptions.find(s => s.value === interview.status).color}-100 text-${statusOptions.find(s => s.value === interview.status).color}-800`
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {interview.status || "-"}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <FiClock className="mr-1 text-gray-400" />
                            {new Date(interview.interviewDateTime).toLocaleString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiUser className="mr-1 text-gray-400" />
                            {interview.interviewerName || "-"}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(interview)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(interview.id)}
                            className="text-red-600 hover:text-red-900 flex items-center text-sm"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrInterview;