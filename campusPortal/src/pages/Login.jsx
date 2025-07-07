import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Users, Building, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate your existing API call logic
    try {
      // Replace this with your actual API call:
      const response = await api.post('/auth/login', { email, password });
      const { token, role, name, id } = response.data;
      
      // Demo simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo role assignment based on email
      // let role = 'STUDENT';
      // if (email.includes('admin')) role = 'ADMIN';
      // else if (email.includes('hr')) role = 'COMPANY_HR';
      // else if (email.includes('officer')) role = 'PLACEMENT_OFFICER';

      // Your localStorage logic here:
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      localStorage.setItem('id', id);

      // Your navigation logic here:
      switch (role) {
        case 'ADMIN': navigate('/admin/dashboard'); break;
        case 'STUDENT': navigate('/student/dashboard'); break;
        case 'COMPANY_HR': navigate('/hr/dashboard'); break;
        case 'PLACEMENT_OFFICER': navigate('/officer/dashboard'); break;
        default: navigate('/unauthorized');
      }

      alert(`Demo: Login successful as ${role}! In your app, this would navigate to the dashboard.`);
      setIsLoading(false);
    } catch (err) {
      setError('Invalid email or password');
      setIsLoading(false);
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
                className="bg-blue-100 p-2 sm:p-3 rounded-full"
                style={{ animation: 'float 3s ease-in-out infinite' }}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div 
                className="bg-green-100 p-2 sm:p-3 rounded-full"
                style={{ animation: 'float 3s ease-in-out infinite 0.5s' }}
              >
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div 
                className="bg-purple-100 p-2 sm:p-3 rounded-full"
                style={{ animation: 'float 3s ease-in-out infinite 1s' }}
              >
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>

            <div className="text-center space-y-1 sm:space-y-2">
              <h2 
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                style={{ animation: 'fadeIn 0.6s ease-out' }}
              >
                Welcome Back
              </h2>
              <p 
                className="text-gray-600 text-sm sm:text-base"
                style={{ animation: 'fadeIn 0.6s ease-out 0.3s both' }}
              >
                Sign in to access your placement dashboard
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Email Field - Mobile Optimized */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type="email"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field - Mobile Optimized */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white/80 transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Error Message */}
              {error && (
                <div 
                  className="bg-red-50 border border-red-200 rounded-xl p-3"
                  style={{ animation: 'shake 0.5s ease-in-out' }}
                >
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Login Button - Mobile Optimized */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group text-sm sm:text-base"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-50" />
                )}
                <span className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div 
                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      <span>Signing you in...</span>
                    </>
                  ) : (
                    <span>Sign In to Portal</span>
                  )}
                </span>
              </button>
            </div>

            {/* Register Link - Mobile Optimized */}
            <div className="text-center pt-3 sm:pt-4 border-t border-gray-200/50">
              <p className="text-gray-600 text-sm sm:text-base">
                New to the portal?{' '}
                <a
                  href="/register"
                  className="text-indigo-600 font-semibold hover:text-purple-600 transition-colors hover:underline"
                  onClick={(e) => {
                    //e.preventDefault();
                    alert('Demo: In your app, this would navigate to the registration page');
                  }}
                >
                  Create Account
                </a>
              </p>
            </div>

            {/* Quick Access Info - Mobile Responsive */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
              <p className="text-xs sm:text-sm text-center text-blue-600 font-medium">
                🎓 Students • 🏢 Companies • 👥 Officers • ⚙️ Admins
              </p>
              <p className="text-xs text-center text-gray-500 mt-1">
                One portal, multiple opportunities
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

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
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

export default Login;