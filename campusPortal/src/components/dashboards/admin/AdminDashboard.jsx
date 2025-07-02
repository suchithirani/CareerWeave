import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Calendar, 
  Bell,
  BarChart3,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  Shield,
  Activity,
  Award,
  Eye,
  Menu,
  Sun,
  Moon,
  X,
  ArrowUp
} from 'lucide-react';
import { dashboardItems } from '../../Data/AdminDashboardItems';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    companies: [],
    applications: [],
    jobOpenings: [],
    loading: true,
    error: null
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalCompanies: 0
  });

  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or use system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) return savedMode === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
    const [showBackToTop, setShowBackToTop] = useState(false);


    useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };



  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Fetch data from APIs
  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const endpoints = [
        { url: 'http://localhost:8080/api/auth/users', key: 'users' },
        { url: 'http://localhost:8080/api/company', key: 'companies' },
        { url: 'http://localhost:8080/api/job-applications', key: 'applications' },
        { url: 'http://localhost:8080/api/job-openings', key: 'jobOpenings' }
      ];

      const results = {};
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            results[endpoint.key] = Array.isArray(data) ? data : [];
          } else {
            console.warn(`Failed to fetch ${endpoint.url}: ${response.status}`);
            results[endpoint.key] = [];
          }
        } catch (error) {
          console.error(`Error fetching ${endpoint.url}:`, error);
          results[endpoint.key] = [];
        }
      }

      setDashboardData({
        users: results.users || [],
        companies: results.companies || [],
        applications: results.applications || [],
        jobOpenings: results.jobOpenings || [],
        loading: false,
        error: null
      });

      // Calculate stats
      setStats({
        totalUsers: results.users ? results.users.length : 0,
        activeJobs: results.jobOpenings ? results.jobOpenings.filter(job => 
          job.status === 'OPEN'
        ).length : 0,
        totalApplications: results.applications ? results.applications.length : 0,
        totalCompanies: results.companies ? results.companies.length : 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data. Please check your connection.'
      }));
    }
  };

  // Get recent activities from the data
  const getRecentActivities = () => {
    const activities = [];
    
    // Recent users (last 2)
    if (dashboardData.users && dashboardData.users.length > 0) {
      const recentUsers = dashboardData.users
        .sort((a, b) => new Date(b.createdAt || b.registrationDate || 0) - new Date(a.createdAt || a.registrationDate || 0))
        .slice(0, 2);
      
      recentUsers.forEach(user => {
        activities.push({
          type: 'user',
          icon: Users,
          title: 'New user registered',
          description: `${user.name || user.username || user.email || 'New user'} joined the platform`,
          time: formatTimeAgo(user.createdAt || user.registrationDate),
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          iconColor: 'text-white',
          timestamp: new Date(user.createdAt || user.registrationDate || 0)
        });
      });
    }

    // Recent job openings (last 2)
    if (dashboardData.jobOpenings && dashboardData.jobOpenings.length > 0) {
      const recentJobs = dashboardData.jobOpenings
        .sort((a, b) => new Date(b.createdAt || b.postedDate || 0) - new Date(a.createdAt || a.postedDate || 0))
        .slice(0, 2);
      
      recentJobs.forEach(job => {
        activities.push({
          type: 'job',
          icon: Briefcase,
          title: 'New job posted',
          description: `${job.title || job.position || 'Job opening'} at ${job.title || job.companyName || 'Company'}`,
          time: formatTimeAgo(job.createdAt || job.postedDate),
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          iconColor: 'text-white',
          timestamp: new Date(job.createdAt || job.postedDate || 0)
        });
      });
    }

    // Recent applications (last 2)
    if (dashboardData.applications && dashboardData.applications.length > 0) {
      const recentApplications = dashboardData.applications
        .sort((a, b) => new Date(b.createdAt || b.appliedDate || 0) - new Date(a.createdAt || a.appliedDate || 0))
        .slice(0, 2);
      
      recentApplications.forEach(app => {
        activities.push({
          type: 'application',
          icon: FileText,
          title: 'Application submitted',
          description: `${app.applicantName || app.userName || 'Applicant'} applied for ${app.jobTitle || app.position || 'position'}`,
          time: formatTimeAgo(app.createdAt || app.appliedDate),
          bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
          iconColor: 'text-white',
          timestamp: new Date(app.createdAt || app.appliedDate || 0)
        });
      });
    }

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);
  };

  // Format time ago helper
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const recentActivities = getRecentActivities();

  // Group dashboard items by category
  const groupedItems = dashboardItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold dark:text-white">Admin Panel</span>
          </div>
          <button onClick={toggleMobileMenu} className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {groupedItems[category].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'text-gray-200 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      {item.title}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold dark:text-white">Dashboard</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 hidden lg:block">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-2xl">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Activity className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-5xl font-black bg-gradient-to-r ${darkMode ? 'from-gray-100 via-blue-100 to-purple-100' : 'from-gray-900 via-blue-900 to-purple-900'} bg-clip-text text-transparent mb-3`}>
                    Admin Dashboard
                  </h1>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xl font-medium`}>Comprehensive platform management & analytics</p>
                  <div className={`flex items-center mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Last updated: {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={toggleDarkMode}
                  className={`p-3 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button 
                  onClick={fetchDashboardData}
                  disabled={dashboardData.loading}
                  className={`group ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-white hover:bg-blue-50 text-blue-600'} font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 border ${darkMode ? 'border-gray-700' : 'border-blue-100'}`}
                >
                  <RefreshCw className={`w-5 h-5 ${dashboardData.loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  <span>Refresh Data</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
            
            {dashboardData.error && (
              <div className={`bg-gradient-to-r ${darkMode ? 'from-red-900/50 to-pink-900/50 border-red-800' : 'from-red-50 to-pink-50 border-red-200'} border rounded-xl p-4 flex items-center space-x-3 shadow-lg`}>
                <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-500'} animate-pulse`} />
                <p className={darkMode ? 'text-red-300' : 'text-red-700'}>{dashboardData.error}</p>
              </div>
            )}
          </div>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'Total Users',
                value: stats.totalUsers,
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-blue-50',
                growth: '+12%'
              },
              {
                title: 'Active Jobs',
                value: stats.activeJobs,
                icon: Briefcase,
                color: 'from-green-500 to-emerald-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-green-50',
                growth: '+8%'
              },
              {
                title: 'Applications',
                value: stats.totalApplications,
                icon: FileText,
                color: 'from-orange-500 to-yellow-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-orange-50',
                growth: '+24%'
              },
              {
                title: 'Companies',
                value: stats.totalCompanies,
                icon: Building2,
                color: 'from-purple-500 to-pink-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-purple-50',
                growth: '+5%'
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className={`${stat.bgPattern} ${darkMode ? 'border-gray-700' : 'border-white'} rounded-2xl p-6 shadow-lg border backdrop-blur-sm hover:shadow-xl transition-all duration-300 group cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.growth}
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.title}</p>
                    <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
  {dashboardData.loading ? (
    <div className={`animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} h-8 w-16 rounded`}></div>
  ) : (
    stat.value.toLocaleString()
  )}
</div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                      <div className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-1000 ease-out`} 
                          style={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Dashboard Grid with Categories */}
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category} className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{category}</h2>
                  <div className={`flex-1 h-px ${darkMode ? 'bg-gradient-to-r from-gray-700' : 'bg-gradient-to-r from-gray-300'} to-transparent`}></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedItems[category].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={index}
                        className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <div className={`relative rounded-2xl p-6 shadow-lg hover:shadow-2xl border transition-all duration-300 overflow-hidden ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                            : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}>
                          {/* Background Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                                <IconComponent className="w-7 h-7 text-white" />
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                              </div>
                            </div>
                            
                            <h3 className={`text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.title}
                            </h3>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                              {item.description}
                            </p>
                            
                            {/* Action Indicator */}
                            <div className={`mt-4 flex items-center text-xs ${darkMode ? 'text-gray-500 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-500'} transition-colors duration-300`}>
                              <Eye className="w-3 h-3 mr-1" />
                              <span>Click to manage</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Recent Activity Section */}
          <div className={`mt-16 rounded-2xl shadow-xl border overflow-hidden ${
            darkMode 
              ? 'bg-gray-800/60 backdrop-blur-sm border-gray-700' 
              : 'bg-white/60 backdrop-blur-sm border-white/50'
          }`}>
            <div className={`p-6 border-b ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-2xl font-bold flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Activity className={`w-6 h-6 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    Recent Activity
                  </h3>
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Real-time updates from across your platform</p>
                </div>
                <div className={`text-sm ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-white text-gray-500'
                } px-3 py-1 rounded-full`}>
                  Live Updates
                </div>
              </div>
            </div>
            <div className="p-6">
              {dashboardData.loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-ping"></div>
                  </div>
                  <span className={`ml-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading recent activities...</span>
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div 
                        key={index} 
                        className={`group flex items-center space-x-4 p-4 rounded-xl hover:shadow-md transition-all duration-300 border ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' 
                            : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                        }`}
                      >
                        <div className={`w-12 h-12 ${activity.bgColor} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`w-6 h-6 ${activity.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold group-hover:text-blue-600 transition-colors duration-300 ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {activity.title}
                          </p>
                          <p className={`text-sm mt-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>{activity.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm ${
                            darkMode 
                              ? 'bg-gray-600 text-gray-300' 
                              : 'bg-gray-100 text-gray-500'
                          } px-3 py-1 rounded-full`}>
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className={`w-16 h-16 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <FileText className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>No recent activities</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activities will appear here as they happen</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
              : 'bg-white hover:bg-blue-50 text-blue-600'
          }`}
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default AdminDashboard;