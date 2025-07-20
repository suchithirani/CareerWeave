import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Briefcase, 
  FileText, 
  Calendar, 
  Bell,
  RefreshCw,
  AlertCircle,
  ClipboardCheck,
  Clock,
  LogOut,
  CheckCircle,
  XCircle,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  BarChart2,
  Activity,
  ArrowUp,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    jobOpenings: [],
    applications: [],
    interviews: [],
    notifications: [],
    offers: [],
    loading: true,
    error: null
  });
  const userId = localStorage.getItem('id');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) return savedMode === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const [stats, setStats] = useState({
    activeJobOpenings: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
    unreadNotifications: 0,
    activeOffers: 0
  });

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
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

  const formatInterviewTime = (dateTimeString) => {
    if (!dateTimeString) return 'Scheduled';
    try {
      const interviewDate = new Date(dateTimeString);
      if (isNaN(interviewDate.getTime())) return 'Scheduled';
      const now = new Date();
      const diffInHours = Math.floor((interviewDate - now) / (1000 * 60 * 60));
      if (diffInHours < 0) return 'Past due';
      if (diffInHours < 24) return `Today at ${interviewDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      if (diffInHours < 48) return `Tomorrow at ${interviewDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      return `On ${interviewDate.toLocaleDateString([], {month: 'short', day: 'numeric'})}`;
    } catch (error) {
      return 'Scheduled';
    }
  };

  const getRecentActivities = () => {
    const activities = [];
    const now = new Date();
    
    if (dashboardData.applications?.length > 0) {
      const recentApplications = dashboardData.applications
        .sort((a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt))
        .slice(0, 2);
      
      recentApplications.forEach(app => {
        activities.push({
          type: 'application',
          icon: FileText,
          title: 'Application Status',
          description: `Application for ${app.jobTitle || 'job'} is ${app.status || 'submitted'}`,
          time: formatTimeAgo(app.appliedDate || app.createdAt),
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
          iconColor: 'text-white',
          timestamp: new Date(app.appliedDate || app.createdAt),
          applicationId: app.id
        });
      });
    }

    if (dashboardData.interviews?.length > 0) {
      const upcomingInterviews = dashboardData.interviews
        .filter(interview => {
          const interviewDate = interview.dateTime || interview.scheduledTime;
          return interviewDate && new Date(interviewDate) > now;
        })
        .sort((a, b) => new Date(a.dateTime || a.scheduledTime) - new Date(b.dateTime || b.scheduledTime))
        .slice(0, 2);
      
      upcomingInterviews.forEach(interview => {
        activities.push({
          type: 'interview',
          icon: Calendar,
          title: 'Upcoming Interview',
          description: `Interview with ${interview.companyName || 'company'} for ${interview.jobTitle || 'position'}`,
          time: formatInterviewTime(interview.dateTime || interview.scheduledTime),
          bgColor: 'bg-gradient-to-r from-amber-500 to-yellow-500',
          iconColor: 'text-white',
          timestamp: new Date(interview.dateTime || interview.scheduledTime),
          interviewId: interview.id
        });
      });
    }

    if (dashboardData.offers?.length > 0) {
      const recentOffers = dashboardData.offers
        .sort((a, b) => new Date(b.offerDate || b.createdAt) - new Date(a.offerDate || a.createdAt))
        .slice(0, 2);
      
      recentOffers.forEach(offer => {
        activities.push({
          type: 'offer',
          icon: offer.status === 'ACCEPTED' ? CheckCircle : (offer.status === 'REJECTED' ? XCircle : ClipboardCheck),
          title: `Job Offer ${offer.status || ''}`,
          description: `Offer from ${offer.companyName || 'company'} for ${offer.jobTitle || 'position'}`,
          time: formatTimeAgo(offer.offerDate || offer.createdAt),
          bgColor: offer.status === 'ACCEPTED' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                  (offer.status === 'REJECTED' ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'),
          iconColor: 'text-white',
          timestamp: new Date(offer.offerDate || offer.createdAt),
          offerId: offer.id
        });
      });
    }

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  const dashboardItems = [
    {
      title: 'My Profile',
      description: 'View and update your profile',
      icon: User,
      path: '/student/profile',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Job Openings',
      description: 'Browse available job opportunities',
      icon: Briefcase,
      path: '/student/job-openings',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'My Applications',
      description: 'View your job applications',
      icon: FileText,
      path: '/student/applications',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Interviews',
      description: 'View your interview schedule',
      icon: Calendar,
      path: '/student/interviews',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      title: 'Notifications',
      description: 'View campus placement updates',
      icon: Bell,
      path: '/student/notifications',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Job Offers',
      description: 'View your job offers',
      icon: ClipboardCheck,
      path: '/student/offers',
      color: 'from-indigo-500 to-violet-500'
    },
    {
      title: 'Help',
      description: 'Get support or FAQs about the placement process',
      icon: HelpCircle,
      path: '/student/help',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Feedback',
      description: 'Give feedback about the portal or placement process',
      icon: MessageSquare,
      path: '/student/feedback',
      color: 'from-red-500 to-orange-500'
    }
  ];

  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [profileRes, jobsRes, appsRes, interviewsRes, notificationsRes, offersRes] = await Promise.all([
        fetch('http://localhost:8080/api/student/profile/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        }),
        fetch('http://localhost:8080/api/job-openings/status/OPEN', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        }),
        fetch('http://localhost:8080/api/job-applications/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        }),
        fetch('http://localhost:8080/api/interview-schedules/student', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        }),
        fetch(`http://localhost:8080/api/notifications/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        }),
        fetch('http://localhost:8080/api/job-offers/student', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        })
      ]);

      const [profileData, jobsData, appsData, interviewsData, notificationsData, offersData] = await Promise.all([
        profileRes.ok ? profileRes.json() : null,
        jobsRes.ok ? jobsRes.json() : [],
        appsRes.ok ? appsRes.json() : [],
        interviewsRes.ok ? interviewsRes.json() : [],
        notificationsRes.ok ? notificationsRes.json() : [],
        offersRes.ok ? offersRes.json() : []
      ]);

      if (!profileRes.ok) throw new Error('Failed to load student profile');

      setDashboardData({
        profile: profileData,
        jobOpenings: Array.isArray(jobsData) ? jobsData : [],
        applications: Array.isArray(appsData) ? appsData : [],
        interviews: Array.isArray(interviewsData) ? interviewsData : [],
        notifications: Array.isArray(notificationsData) ? notificationsData : [],
        offers: Array.isArray(offersData) ? offersData : [],
        loading: false,
        error: null
      });

      setStats({
        activeJobOpenings: Array.isArray(jobsData) ? jobsData.filter(job => 
          job.status === 'ACTIVE' || job.status === 'OPEN'
        ).length : 0,
        pendingApplications: Array.isArray(appsData) ? appsData.filter(app => 
          app.status === 'APPLIED' || app.status === 'UNDER_REVIEW' || app.status === 'INTERVIEW_SCHEDULED'
        ).length : 0,
        scheduledInterviews: Array.isArray(interviewsData) ? interviewsData.filter(interview => 
          interview.status === 'Scheduled'
        ).length : 0,
        unreadNotifications: Array.isArray(notificationsData) ? notificationsData.filter(n => 
          !n.read_status
        ).length : 0,
        activeOffers: Array.isArray(offersData) ? offersData.filter(offer => 
          offer.status === 'PENDING'
        ).length : 0
      });

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load dashboard data'
      }));
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to mark notification as read');
      
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification => 
          notification.id === notificationId ? { ...notification, read_status: true } : notification
        )
      }));
      
      setStats(prev => ({
        ...prev,
        unreadNotifications: prev.unreadNotifications - 1
      }));
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error(error.message || 'Failed to mark notification as read');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/job-offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ action: action.toUpperCase() })
      });
      
      if (!response.ok) throw new Error(`Failed to ${action} offer`);
      
      toast.success(`Offer ${action.toLowerCase()} successfully`);
      fetchDashboardData();
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error);
      toast.error(error.message || `Failed to ${action} offer`);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    if (!token || role !== 'STUDENT') {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const recentActivities = getRecentActivities();
  const studentName = localStorage.getItem('name') || 'Student';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold dark:text-white">Student Portal</span>
          </div>
          <button onClick={toggleMobileMenu} className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          {dashboardItems.map((item, index) => {
            const IconComponent = item.icon;
            const hasNotification = item.title === 'Notifications' && stats.unreadNotifications > 0;
            
            return (
              <div key={index} className="mb-2">
                <button
                  onClick={() => {
                    handleNavigation(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode 
                      ? 'text-gray-200 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  {item.title}
                  {hasNotification && (
                    <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
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

        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">          
          {/* Header Section */}
          <div className="mb-12 hidden lg:block">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-2xl">
                    <BarChart2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Activity className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-5xl font-black bg-gradient-to-r ${darkMode ? 'from-gray-100 via-blue-100 to-purple-100' : 'from-gray-900 via-blue-900 to-purple-900'} bg-clip-text text-transparent mb-3`}>
                    Student Dashboard
                  </h1>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xl font-medium`}>Your campus placement portal</p>
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
                 {/* <button
      onClick={() => handleNavigation('/student/profile')}
      className={`p-3 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
      aria-label="Profile"
    >
      <User className="w-5 h-5" />
    </button> */}
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {[
              {
                title: 'Active Jobs',
                value: stats.activeJobOpenings,
                icon: Briefcase,
                color: 'from-blue-500 to-cyan-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-blue-50',
                growth: '+5%'
              },
              {
                title: 'My Applications',
                value: dashboardData.applications?.length || 0,
                icon: FileText,
                color: 'from-green-500 to-emerald-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-green-50',
                growth: '+12%'
              },
              {
                title: 'Pending Apps',
                value: stats.pendingApplications,
                icon: Clock,
                color: 'from-amber-500 to-yellow-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-amber-50',
                growth: '+8%'
              },
              {
                title: 'Interviews',
                value: stats.scheduledInterviews,
                icon: Calendar,
                color: 'from-purple-500 to-pink-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-purple-50',
                growth: '+3%'
              },
              {
                title: 'Job Offers',
                value: stats.activeOffers,
                icon: ClipboardCheck,
                color: 'from-indigo-500 to-violet-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-indigo-50',
                growth: '+2%'
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
                          style={{ width: `${Math.min((stat.value / 20) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dashboard Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {dashboardItems.map((item, index) => {
              const IconComponent = item.icon;
              const hasNotification = item.title === 'Notifications' && stats.unreadNotifications > 0;
              
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
                    
                    {hasNotification && (
                      <span className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-pulse shadow-lg shadow-pink-500/30">
                        {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                      </span>
                    )}
                    
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
                        <span>Click to view</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity Section */}
          <div className={`rounded-2xl shadow-xl border overflow-hidden ${
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
                  <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Updates on your placement journey</p>
                </div>
                <div className={`text-sm ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-white text-gray-500'
                } px-3 py-1 rounded-full`}>
                  Latest Updates
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
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your activities will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Offers Section */}
          {stats.activeOffers > 0 && (
            <div className={`mt-6 rounded-2xl shadow-xl border overflow-hidden ${
              darkMode 
                ? 'bg-gray-800/60 backdrop-blur-sm border-gray-700' 
                : 'bg-white/60 backdrop-blur-sm border-white/50'
            }`}>
              <div className={`p-6 border-b ${
                darkMode 
                  ? 'bg-gradient-to-r from-indigo-900/50 to-violet-900/50 border-indigo-800' 
                  : 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold flex items-center ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <ClipboardCheck className={`w-6 h-6 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      Pending Job Offers
                    </h3>
                    <p className={`mt-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>You have offers waiting for your response</p>
                  </div>
                  <div className={`text-sm ${
                    darkMode 
                      ? 'bg-indigo-700 text-indigo-200' 
                      : 'bg-indigo-100 text-indigo-700'
                  } px-3 py-1 rounded-full`}>
                    Action Required
                  </div>
                </div>
              </div>
              <div className="p-6">
                {dashboardData.offers
                  .filter(offer => offer.status === 'PENDING')
                  .map((offer, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-indigo-900/10 rounded-lg mb-3 border border-indigo-800/30 hover:border-indigo-500/50 transition-colors duration-300">
                      <div className="mb-3 sm:mb-0">
                        <h4 className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {offer.jobTitle} at {offer.companyName}
                        </h4>
                        <p className={`text-xs sm:text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                          Received {formatTimeAgo(offer.offerDate || offer.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOfferAction(offer.id, 'accept');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 shadow-lg shadow-emerald-900/30 flex-1 sm:flex-none"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOfferAction(offer.id, 'reject');
                          }}
                          className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 shadow-lg shadow-rose-900/30 flex-1 sm:flex-none"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleNavigation(`/student/job-offers/${offer.id}`)}
                          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 border ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex-1 sm:flex-none`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => handleNavigation('/student/job-openings')}
              className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 flex items-center space-x-2 text-sm`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Jobs</span>
            </button>
            <button 
              onClick={() => handleNavigation('/student/profile')}
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} font-medium px-4 py-2 rounded-xl shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-all duration-300 flex items-center space-x-2 text-sm`}
            >
              <User className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
            <button 
              onClick={() => handleNavigation('/student/applications')}
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} font-medium px-4 py-2 rounded-xl shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-all duration-300 flex items-center space-x-2 text-sm`}
            >
              <FileText className="w-4 h-4" />
              <span>View Applications</span>
            </button>
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

export default StudentDashboard;