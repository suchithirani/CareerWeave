import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Users, Building, GraduationCap, UserPlus } from 'lucide-react';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentDashboard from '../components/dashboards/student/StudentDashboard';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRegister = location.pathname === '/admin/register';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: isAdminRegister ? '' : 'STUDENT',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const availableRoles = isAdminRegister
    ? ['COMPANY_HR', 'PLACEMENT_OFFICER']
    : ['STUDENT'];

  useEffect(() => {
    if (isAdminRegister) {
      const role = localStorage.getItem('role');
      if (role !== 'ADMIN') {
        navigate('/unauthorized');
      }

      window.history.pushState(null, '', window.location.href);
      const onPopState = () => {
        navigate('/admin/dashboard', { replace: true });
      };
      window.addEventListener('popstate', onPopState);
      return () => {
        window.removeEventListener('popstate', onPopState);
      };
    }
  }, [isAdminRegister, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    toast.error("Passwords don't match");
    return;
  }

  if (isAdminRegister && !form.role) {
    toast.error('Please select a role.');
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    const config = isAdminRegister
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      roles: [form.role],
    };

    const endpoint = isAdminRegister ? '/auth/admin-register' : '/auth/register';

    const res = await api.post(endpoint, payload, config);

    toast.success(res.data.message || 'Registration successful');

    // Store user data in localStorage if it's a student registration
    if (!isAdminRegister && res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'STUDENT');
      localStorage.setItem('name', form.name);
      localStorage.setItem('id', res.data.id || '');
    }

    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: isAdminRegister ? '' : 'STUDENT',
    });

    setTimeout(() => {
      if (isAdminRegister) {
        if (form.role === 'COMPANY_HR') {
          navigate('/hr/dashboard');
        } else if (form.role === 'PLACEMENT_OFFICER') {
          navigate('/officer/dashboard');
        }
      } else {
        // For student registration, navigate to student dashboard
        navigate('/student/dashboard');
      }
    }, 1000);
  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || 'Registration failed';
    toast.error(errMsg);
  } finally {
    setLoading(false);
  }
};

  const FloatingShape = ({ className, delay = 0 }) => (
    <div 
      className={`absolute rounded-full opacity-20 ${className}`}
      style={{ 
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s` 
      }}
    />
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        className="mt-16"
        toastClassName="backdrop-blur-sm"
      />
      
      {/* Floating Background Shapes - Responsive */}
      <FloatingShape className="w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 -top-10 -left-10 sm:-top-20 sm:-left-20" delay={0} />
      <FloatingShape className="w-64 h-64 sm:w-96 sm:h-96 bg-purple-300 -bottom-16 -right-16 sm:-bottom-32 sm:-right-32" delay={2} />
      <FloatingShape className="w-32 h-32 sm:w-48 sm:h-48 bg-indigo-300 top-1/4 right-1/4" delay={4} />
      
      {/* Header with Campus Placement Branding - Mobile Optimized */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <div 
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3"
            style={{ animation: 'bounce 2s infinite' }}
          >
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <h1 
              className="text-lg sm:text-2xl font-bold text-indigo-800"
              style={{ animation: 'fadeIn 1s ease-out' }}
            >
              Campus Placement Portal
            </h1>
            <p 
              className="text-indigo-600 text-xs sm:text-sm hidden xs:block"
              style={{ animation: 'fadeIn 1s ease-out 0.2s both' }}
            >
              Bridging Students with Opportunities
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 pt-20 sm:pt-24 pb-4">
        <div className="relative">
          {/* Glassmorphism Card - Mobile Responsive */}
          <div 
            className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-md p-4 sm:p-8 space-y-4 sm:space-y-6 border border-white/20 mx-2 sm:mx-0"
            style={{ animation: 'slideUp 0.8s ease-out' }}
          >
            
            {/* Role Icons - Mobile Responsive */}
            <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div 
                className="bg-green-100 p-2 sm:p-3 rounded-full"
                style={{ animation: 'float 3s ease-in-out infinite' }}
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div 
                className="bg-blue-100 p-2 sm:p-3 rounded-full"
                style={{ animation: 'float 3s ease-in-out infinite 0.5s' }}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div 
                className="bg-purple-100 p-2 sm:p-3 rounded-full"
                style={{ animation: 'float 3s ease-in-out infinite 1s' }}
              >
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>

            <div className="text-center space-y-1 sm:space-y-2">
              <h2 
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                style={{ animation: 'fadeIn 0.6s ease-out' }}
              >
                {isAdminRegister ? 'Register New User' : 'Join Our Portal'}
              </h2>
              <p 
                className="text-gray-600 text-sm sm:text-base"
                style={{ animation: 'fadeIn 0.6s ease-out 0.3s both' }}
              >
                {isAdminRegister 
                  ? 'Create accounts for HR and Placement Officers' 
                  : 'Create your account to access placement opportunities'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Full Name Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    name="name"
                    type="text"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    name="email"
                    type="email"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder={isAdminRegister ? "user@company.com" : "student@college.edu"}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3 bg-white/50 backdrop-blur-sm border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:bg-white/80 transition-all duration-300 hover:border-gray-300 text-sm sm:text-base ${
                      form.password && form.confirmPassword && form.password !== form.confirmPassword
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
                {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                )}
              </div>

              {/* Role Selection for Admin Register */}
              {isAdminRegister && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Assign Role
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableRoles.map((role) => (
                      <label key={role} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/80 transition-all">
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={form.role === role}
                          onChange={handleChange}
                          className="accent-indigo-500"
                        />
                        <span className="font-medium">
                          {role === 'COMPANY_HR' ? '🏢 Company HR' : '👥 Placement Officer'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading || form.password !== form.confirmPassword}
                className="w-full relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group text-sm sm:text-base"
              >
                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-50" />
                )}
                <span className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <div 
                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>{isAdminRegister ? 'Register User' : 'Create Account'}</span>
                  )}
                </span>
              </button>
            </form>

            {/* Login Link */}
            {!isAdminRegister && (
              <div className="text-center pt-3 sm:pt-4 border-t border-gray-200/50">
                <p className="text-gray-600 text-sm sm:text-base">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="text-indigo-600 font-semibold hover:text-purple-600 transition-colors hover:underline"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            )}

            {/* Quick Access Info */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 sm:p-4 border border-green-100">
              <p className="text-xs sm:text-sm text-center text-green-600 font-medium">
                {isAdminRegister 
                  ? '🏢 HR Registration • 👥 Officer Registration'
                  : '🎓 Student Registration • 🚀 Career Opportunities'
                }
              </p>
              <p className="text-xs text-center text-gray-500 mt-1">
                {isAdminRegister 
                  ? 'Empowering recruitment teams'
                  : 'Your career journey starts here'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -10px, 0);
          }
          70% {
            transform: translate3d(0, -5px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;