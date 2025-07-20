import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  BookOpen,
  Hash,
  GraduationCap,
  Award,
  Calendar,
  FileText,
  Edit,
  Save,
  X,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  Loader
} from 'lucide-react';
import BackButton from '../../BackButton';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    enrollmentNumber: '',
    branch: '',
    degree: '',
    cgpa: '',
    passingYear: '',
    resumeLink: '',
    skills: '',
    name: '',
    email: ''
  });

  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/student/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        const user = res.data.user || {};
        setProfile(res.data);
        setFormData({
          ...res.data,
          name: user.name || '',
          email: user.email || ''
        });
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading student profile:', error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Use only POST for both create and update
      await api.post('/student/profile/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(profile ? 'Profile updated successfully!' : 'Profile created successfully!');
      fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white text-black">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 sm:p-6">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <Loader className="animate-spin h-12 w-12 text-indigo-600" />
            </div>
          </div>
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

        <div className="relative z-10 max-full mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                    <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Student Profile
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    {isEditing ? (profile ? 'Update your academic details' : 'Create your student profile') : 'View your academic profile'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchProfile}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Refresh</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* User Profile Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                  <User className="w-6 h-6 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{formData.name}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Student</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-gray-800 text-sm sm:text-base break-all">{formData.email}</p>
                  </div>
                </div>

                {profile && !isEditing && (
                  <>
                    <div className="flex items-start">
                      <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Enrollment Number</h3>
                        <p className="text-gray-800 text-sm sm:text-base">{profile.enrollmentNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Branch</h3>
                        <p className="text-gray-800 text-sm sm:text-base">{profile.branch}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Academic Details Form */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                Academic Information
              </h2>

              {profile && !isEditing ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <ProfileField 
                      icon={<Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Enrollment Number" 
                      value={profile.enrollmentNumber} 
                    />
                    <ProfileField 
                      icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Branch" 
                      value={profile.branch} 
                    />
                    <ProfileField 
                      icon={<GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Degree" 
                      value={profile.degree} 
                    />
                    <ProfileField 
                      icon={<Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="CGPA" 
                      value={profile.cgpa} 
                    />
                    <ProfileField 
                      icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Passing Year" 
                      value={profile.passingYear} 
                    />
                  </div>
                  
                  <ProfileField 
                    icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                    label="Resume" 
                    value={
                      profile.resumeLink ? (
                        <a 
                          href={profile.resumeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center"
                        >
                          View Resume <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                        </a>
                      ) : 'Not provided'
                    } 
                  />
                  
                  <ProfileField 
                    icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                    label="Skills" 
                    value={profile.skills || 'Not specified'} 
                    fullWidth
                  />

                  <div className="mt-6 sm:mt-8 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Edit Profile</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormInput 
                      icon={<Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Enrollment Number" 
                      name="enrollmentNumber" 
                      value={formData.enrollmentNumber} 
                      onChange={handleChange} 
                      required 
                    />
                    <FormInput 
                      icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Branch" 
                      name="branch" 
                      value={formData.branch} 
                      onChange={handleChange} 
                      required 
                    />
                    <FormInput 
                      icon={<GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Degree" 
                      name="degree" 
                      value={formData.degree} 
                      onChange={handleChange} 
                      required 
                    />
                    <FormInput 
                      icon={<Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="CGPA" 
                      name="cgpa" 
                      value={formData.cgpa} 
                      onChange={handleChange} 
                      type="number" 
                      step="0.01" 
                      required 
                    />
                    <FormInput 
                      icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                      label="Passing Year" 
                      name="passingYear" 
                      value={formData.passingYear} 
                      onChange={handleChange} 
                      type="number" 
                      required 
                    />
                  </div>

                  <FormInput 
                    icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                    label="Resume Link" 
                    name="resumeLink" 
                    value={formData.resumeLink} 
                    onChange={handleChange} 
                    placeholder="https://drive.google.com/your-resume" 
                  />

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3" />
                      Skills (comma separated)
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      placeholder="Java, React, Python, Machine Learning..."
                    />
                  </div>

                  <div className="mt-6 sm:mt-8 flex justify-end gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        if (profile) {
                          setIsEditing(false);
                          setFormData({
                            ...profile,
                            name: profile.user?.name || '',
                            email: profile.user?.email || ''
                          });
                        } else {
                          fetchProfile();
                        }
                      }}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Cancel</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                      <span>{profile ? 'Save Changes' : 'Create Profile'}</span>
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ icon, label, name, value, onChange, type = "text", required = false, placeholder = "", step }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
      {icon}
      <span className="ml-2 sm:ml-3">{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      step={step}
      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

const ProfileField = ({ icon, label, value, fullWidth = false }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className={`${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}
  >
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
      {icon}
      <span className="ml-2 sm:ml-3">{label}</span>
    </label>
    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/70 border border-gray-200 rounded-lg sm:rounded-xl text-gray-800 text-sm sm:text-base">
      {value}
    </div>
  </motion.div>
);

export default StudentProfile;