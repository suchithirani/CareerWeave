import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { toast } from "react-toastify";
import { 
  User,
  Mail,
  MapPin,
  Phone,
  Globe,
  FileText,
  Edit,
  Save,
  X,
  ChevronRight,
  Briefcase,
  Shield,
  AlertCircle,
  Loader,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import BackButton from '../../BackButton';

const HrProfile = () => {
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({
    location: '',
    contactInfo: '',
    description: '',
    websiteUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, companyRes] = await Promise.all([
        api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/company/my-company', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setUser(userRes.data);
      setCompany({
        name: companyRes.data.name || '',
        location: companyRes.data.location || '',
        contactInfo: companyRes.data.contactInfo || '',
        description: companyRes.data.description || '',
        websiteUrl: companyRes.data.websiteUrl || ''
      });
    } catch (error) {
      console.error('Error loading HR profile:', error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyUpdate = async () => {
    try {
      await api.put('/company/hr-update', company, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Company details updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
      toast.error("Update failed. Please try again.");
    }
  };

  if (loading) return (
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
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg sm:shadow-2xl">
                    <Briefcase className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                    HR Profile Management
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg font-medium">
                    Update your company's contact information
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:gap-4">
                <BackButton className="text-sm sm:text-base" />
                <button
                  onClick={fetchData}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Refresh</span>
                </button>
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">HR Representative</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-gray-800 text-sm sm:text-base break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">Company</h3>
                    <p className="text-gray-800 text-sm sm:text-base">{company.name || 'Your Company'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Contact Form */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                Company Contact Information
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500" />
                    Office Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={company.location}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      placeholder="Enter headquarters address"
                    />
                  ) : (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/70 border border-gray-200 rounded-lg sm:rounded-xl text-gray-800 text-sm sm:text-base">
                      {company.location || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500" />
                    HR Contact Email/Phone
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="contactInfo"
                      value={company.contactInfo}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      placeholder="Phone/email for candidate inquiries"
                    />
                  ) : (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/70 border border-gray-200 rounded-lg sm:rounded-xl text-gray-800 text-sm sm:text-base">
                      {company.contactInfo || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500" />
                    Career Page/Website
                  </label>
                  {editing ? (
                    <input
                      type="url"
                      name="websiteUrl"
                      value={company.websiteUrl}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      placeholder="https://company.com/careers"
                    />
                  ) : (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/70 border border-gray-200 rounded-lg sm:rounded-xl text-gray-800 text-sm sm:text-base">
                      {company.websiteUrl ? (
                        <a 
                          href={company.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all inline-flex items-center"
                        >
                          {company.websiteUrl}
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                        </a>
                      ) : 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500" />
                    Company Description (For Candidates)
                  </label>
                  {editing ? (
                    <textarea
                      name="description"
                      value={company.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 text-sm sm:text-base"
                      placeholder="Brief description for job postings"
                    />
                  ) : (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/70 border border-gray-200 rounded-lg sm:rounded-xl text-gray-800 text-sm sm:text-base whitespace-pre-line">
                      {company.description || 'No description provided'}
                    </div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-yellow-800">Important Note</h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        Changes to legal company details require admin approval. Only contact information visible to candidates can be updated here.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 sm:mt-8 flex justify-end gap-2 sm:gap-3">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Update Details</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleCompanyUpdate}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Save Changes</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrProfile;