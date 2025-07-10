import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Calendar, 
  Bell,
  BarChart3,
  RefreshCw,
  AlertCircle,
  ClipboardCheck,
  UserPlus,
  Clock,
  Mail,
  Settings,
  LogOut,
  Building,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  ChevronRight,
  Eye,
  Sun,
  Moon,
  Menu,
  X,
  ArrowUp,
  Activity,
  TrendingUp,
  ArrowRight,
  Handshake,
  UserCheck,
  User,
  
} from 'lucide-react';
import { toast } from 'react-toastify';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    companies: [],
    hrUsers: [],
    students: [],
    jobOpenings: [],
    applications: [],
    interviews: [],
    loading: true,
    error: null
  });

  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalHRs: 0,
    totalStudents: 0,
    activeJobOpenings: 0,
    pendingApplications: 0,
    scheduledInterviews: 0
  });

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

  const officerDashboardItems = [
    {
  title: 'My Profile',
  description: 'View and update your details',
  icon: User,
  path: '/officer/profile',
  color: 'from-sky-500 to-sky-600',
},

    {
      title: 'Companies',
      description: 'View all registered companies',
      icon: Building,
      path: '/officer/companies',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'HR Users',
      description: 'Manage company HR representatives',
      icon: Users,
      path: '/officer/hr-users',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Students',
      description: 'View all student profiles',
      icon: GraduationCap,
      path: '/officer/students',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Job Openings',
      description: 'View all active job postings',
      icon: Briefcase,
      path: '/officer/job-openings',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Applications',
      description: 'Monitor student applications',
      icon: ClipboardList,
      path: '/officer/applications',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Interviews',
      description: 'Track interview schedules',
      icon: Calendar,
      path: '/officer/interviews',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Notifications',
      description: 'Send announcements',
      icon: Bell,
      path: '/officer/notifications',
      color: 'from-red-500 to-red-600'
    },
    {
  title: 'Offers',
  description: 'Track student job offers',
  icon: Handshake,
  path: '/officer/offers',
  color: 'from-lime-500 to-lime-600'
},

{
  title: 'Onboarding',
  description: 'Manage student onboarding status',
  icon: UserCheck,
  path: '/officer/onboarding',
  color: 'from-sky-500 to-sky-600'
},


    // {
    //   title: 'Reports',
    //   description: 'Generate placement reports',
    //   icon: BarChart3,
    //   path: '/officer/reports',
    //   color: 'from-teal-500 to-teal-600'
    // },
    {
  title: 'Help',
  description: 'Help',
  icon: Handshake,
  path: '/officer/help',
  color: 'from-orange-500 to-lime-600'
},
{
  title: 'Feedback',
  description: 'write your Feedbacks',
  icon: BarChart3,
  path: '/officer/feedback',
  color: 'from-blue-500 to-sky-600'
},
  ];

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const endpoints = [
        { 
          url: 'http://localhost:8080/api/company', 
          key: 'companies',
          errorMessage: 'Failed to load companies'
        },
        { 
          url: 'http://localhost:8080/api/co/officer-companies', 
          key: 'hrUsers',
          errorMessage: 'Failed to load HR users'
        },
        { 
          url: 'http://localhost:8080/api/student/profile/officer', 
          key: 'students',
          errorMessage: 'Failed to load student profiles'
        },
        { 
          url: 'http://localhost:8080/api/job-openings/officer', 
          key: 'jobOpenings',
          errorMessage: 'Failed to load job openings'
        },
        { 
          url: 'http://localhost:8080/api/job-applications/officer', 
          key: 'applications',
          errorMessage: 'Failed to load applications'
        },
        { 
          url: 'http://localhost:8080/api/interview-schedules/officer', 
          key: 'interviews',
          errorMessage: 'Failed to load interviews'
        }
      ];

      const results = {};
      let hasError = false;
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${endpoint.errorMessage}`);
          }
          
          const data = await response.json();
          results[endpoint.key] = Array.isArray(data) ? data : [data];
        } catch (error) {
          console.error(`Error fetching ${endpoint.key}:`, error);
          results[endpoint.key] = [];
          if (!hasError) {
            setDashboardData(prev => ({
              ...prev,
              error: `${endpoint.errorMessage}: ${error.message}`
            }));
            hasError = true;
          }
        }
      }
      
      setDashboardData({
        companies: results.companies || [],
        hrUsers: results.hrUsers || [],
        students: results.students || [],
        jobOpenings: results.jobOpenings || [],
        applications: results.applications || [],
        interviews: results.interviews || [],
        loading: false,
        error: null
      });

      const now = new Date();
      
      setStats({
        totalCompanies: results.companies?.length || 0,
        totalHRs: results.hrUsers?.length || 0,
        totalStudents: results.students?.length || 0,
        activeJobOpenings: results.jobOpenings?.filter(job => {
          const status = String(job.status || job.jobStatus || '').toLowerCase();
          const isActive = Boolean(job.isActive || job.active);
          return status === 'active' || status === 'open' || status === 'published' || isActive ||
                 !Object.prototype.hasOwnProperty.call(job, 'status');
        }).length || 0,
        pendingApplications: results.applications?.filter(app => 
          app.status==='APPLIED'||app.status==='UNDER_REVIEW'||app.status==='INTERVIEW_SCHEDULED'
        ).length || 0,
        scheduledInterviews: results.interviews?.filter(interview => 
          interview.status==='SCHEDULED'
        ).length || 0
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

  const getRecentActivities = () => {
    const activities = [];
    const now = new Date();
    
    if (dashboardData.companies?.length > 0) {
      const recentCompanies = dashboardData.companies
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.registrationDate || 0);
          const dateB = new Date(b.createdAt || b.registrationDate || 0);
          return dateB - dateA;
        })
        .slice(0, 2);
      
      recentCompanies.forEach(company => {
        activities.push({
          type: 'company',
          icon: Building,
          title: 'New Company',
          description: `${company.name || 'Company'} registered`,
          time: formatTimeAgo(company.createdAt || company.registrationDate),
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          iconColor: 'text-white',
          timestamp: new Date(company.createdAt || company.registrationDate || 0),
          companyId: company.id || company._id || null
        });
      });
    }

    if (dashboardData.jobOpenings?.length > 0) {
      const recentJobs = dashboardData.jobOpenings
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.postedDate || 0);
          const dateB = new Date(b.createdAt || b.postedDate || 0);
          return dateB - dateA;
        })
        .slice(0, 2);
      
      recentJobs.forEach(job => {
        activities.push({
          type: 'job',
          icon: Briefcase,
          title: 'New Job Opening',
          description: `${job.title || 'Job'} posted by ${job.companyName || 'Company'}`,
          time: formatTimeAgo(job.createdAt || job.postedDate),
          bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
          iconColor: 'text-white',
          timestamp: new Date(job.createdAt || job.postedDate || 0),
          jobId: job.id || job._id || null
        });
      });
    }

    if (dashboardData.applications?.length > 0) {
      const recentApplications = dashboardData.applications
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.appliedDate || 0);
          const dateB = new Date(b.createdAt || b.appliedDate || 0);
          return dateB - dateA;
        })
        .slice(0, 2);
      
      recentApplications.forEach(app => {
        activities.push({
          type: 'application',
          icon: FileText,
          title: 'New Application',
          description: `${app.studentName || 'Student'} applied to ${app.jobTitle || 'Job'}`,
          time: formatTimeAgo(app.createdAt || app.appliedDate),
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          iconColor: 'text-white',
          timestamp: new Date(app.createdAt || app.appliedDate || 0),
          applicationId: app.id || app._id || null
        });
      });
    }

    if (dashboardData.interviews?.length > 0) {
      const upcomingInterviews = dashboardData.interviews
        .filter(interview => {
          try {
            const interviewDate = interview.dateTime || interview.scheduledTime || interview.date;
            return interviewDate && new Date(interviewDate) > now;
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          const dateA = new Date(a.dateTime || a.scheduledTime || a.date || 0);
          const dateB = new Date(b.dateTime || b.scheduledTime || b.date || 0);
          return dateA - dateB;
        })
        .slice(0, 2);
      
      upcomingInterviews.forEach(interview => {
        activities.push({
          type: 'interview',
          icon: Calendar,
          title: 'Upcoming Interview',
          description: `${interview.studentName || 'Student'} with ${interview.companyName || 'Company'}`,
          time: formatInterviewTime(interview.dateTime || interview.scheduledTime || interview.date),
          bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
          iconColor: 'text-white',
          timestamp: new Date(interview.dateTime || interview.scheduledTime || interview.date || 0),
          interviewId: interview.id || interview._id || null
        });
      });
    }

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const sendNotification = async (recipientType, message) => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          recipientType,
          message
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      
      toast.success('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(error.message || 'Failed to send notification');
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || role !== 'PLACEMENT_OFFICER') {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const recentActivities = getRecentActivities();

  return (
  <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
    {/* Floating Background Elements with Improved Animations */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-1/4 -left-20 w-[30rem] h-[30rem] bg-purple-200 dark:bg-purple-900/20 rounded-full opacity-10 blur-[100px] animate-float-slow animation-delay-0"></div>
      <div className="absolute bottom-1/3 -right-20 w-[30rem] h-[30rem] bg-blue-200 dark:bg-blue-900/20 rounded-full opacity-10 blur-[100px] animate-float-medium animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-[30rem] h-[30rem] bg-indigo-200 dark:bg-indigo-900/10 rounded-full opacity-5 blur-[100px] animate-float-fast animation-delay-2000"></div>
    </div>

    {/* Mobile Sidebar with Glass Morphism Effect */}
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:hidden border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md hover:rotate-12 transition-transform duration-300">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PlacementPro</span>
          </div>
          <button 
            onClick={toggleMobileMenu} 
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation with Enhanced Hover Effects */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-8">
          {[
            { title: "Management", items: officerDashboardItems.slice(0, 4) },
            { title: "Tracking", items: officerDashboardItems.slice(4, 6) },
            { title: "Communication", items: officerDashboardItems.slice(6) }
          ].map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={itemIndex}
                      href={item.path}
                      className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        darkMode 
                          ? 'text-gray-200 hover:bg-gray-700/50 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } relative overflow-hidden`}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <IconComponent className={`w-5 h-5 mr-3 ${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'} transition-transform duration-200 group-hover:scale-110`} />
                      <span className="relative transition-all duration-200 group-hover:font-semibold">
                        {item.title}
                      </span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer with Enhanced Buttons */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleDarkMode}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-300 overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white dark:to-gray-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              {darkMode ? (
                <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="relative flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 group"
            >
              <LogOut className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="relative z-10">
      {/* Enhanced Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between transition-all duration-300">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-300 hover:rotate-12 transition-transform duration-300"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 lg:py-8">
        {/* Enhanced Desktop Header - Full Width */}
        <div className="hidden lg:block mb-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-6">
                  <ClipboardCheck className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md animate-ping-slow">
                  <Activity className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 animate-text-gradient bg-300% animate-gradient">
                  Placement Dashboard
                </h1>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-all duration-300 hover:translate-x-1`}>
                  Manage campus placements efficiently
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} space-x-2 transition-all duration-200 hover:text-blue-500 dark:hover:text-blue-400`}>
                <Clock className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={fetchDashboardData}
                disabled={dashboardData.loading}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-sm hover:shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <RefreshCw className={`w-5 h-5 ${dashboardData.loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>Refresh</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview - Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-10">
          {[
            {
              title: 'Companies',
              value: stats.totalCompanies,
              icon: Building,
              color: 'from-blue-500 to-cyan-500',
              trend: 'up',
              change: '5%'
            },
            {
              title: 'HR Users',
              value: stats.totalHRs,
              icon: Users,
              color: 'from-purple-500 to-fuchsia-500',
              trend: 'up',
              change: '8%'
            },
            {
              title: 'Students',
              value: stats.totalStudents,
              icon: GraduationCap,
              color: 'from-green-500 to-emerald-500',
              trend: 'up',
              change: '12%'
            },
            {
              title: 'Active Jobs',
              value: stats.activeJobOpenings,
              icon: Briefcase,
              color: 'from-yellow-500 to-amber-500',
              trend: 'up',
              change: '15%'
            },
            {
              title: 'Pending Apps',
              value: stats.pendingApplications,
              icon: FileText,
              color: 'from-pink-500 to-rose-500',
              trend: 'up',
              change: '24%'
            },
            {
              title: 'Interviews',
              value: stats.scheduledInterviews,
              icon: Calendar,
              color: 'from-indigo-500 to-violet-500',
              trend: 'up',
              change: '18%'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className={`rounded-xl p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${darkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:bg-white/90'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'} transition-all duration-200 hover:scale-105`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1 transition-all duration-200 hover:translate-x-1`}>{stat.title}</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    {dashboardData.loading ? (
                      <span className="inline-block w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></span>
                    ) : (
                      <span className="animate-count-up" data-count={stat.value}>
                        {stat.value.toLocaleString()}
                      </span>
                    )}
                  </p>
                  <div className={`w-full h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                    <div 
                      className={`h-1.5 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(stat.value / 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Quick Actions Grid - Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6 mb-10">
          {officerDashboardItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`group relative rounded-xl p-6 transition-all duration-300 cursor-pointer ${darkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:bg-white/90'} border ${darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'} shadow-sm hover:shadow-md overflow-hidden animate-fade-in backdrop-blur-sm`}
                style={{ animationDelay: `${index * 50 + 600}ms` }}
              >
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white dark:to-gray-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-md transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                    <IconComponent className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'} transition-all duration-300 group-hover:translate-x-1`} />
                </div>
                
                <h3 className={`text-lg font-bold mb-2 relative z-10 ${darkMode ? 'text-white' : 'text-gray-900'} transition-all duration-200 group-hover:translate-x-1`}>
                  {item.title}
                </h3>
                <p className={`text-sm relative z-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 transition-all duration-200 group-hover:translate-x-1`}>
                  {item.description}
                </p>
                
                <div className={`text-xs font-medium relative z-10 ${darkMode ? 'text-gray-500 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600'} flex items-center transition-all duration-300 group-hover:translate-x-1`}>
                  <span>Manage now</span>
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Recent Activity Section - Full Width */}
        <div className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800/80' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm backdrop-blur-sm`}>
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'} transition-all duration-200 hover:translate-x-1`}>
                  <Activity className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-pulse`} />
                  Recent Activity
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-all duration-200 hover:translate-x-1`}>
                  Latest updates from your placement activities
                </p>
              </div>
              <button 
                onClick={fetchDashboardData}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-all duration-300 hover:-translate-y-0.5`}
              >
                <RefreshCw className={`w-4 h-4 ${dashboardData.loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.loading ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading activities...</p>
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div 
                    key={index} 
                    className={`p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group`}
                    onClick={() => {
                      // Handle navigation based on activity type
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className={`w-5 h-5 ${activity.iconColor} transition-transform duration-300 group-hover:scale-125`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1 transition-all duration-200 group-hover:translate-x-1`}>
                          {activity.title}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-all duration-200 group-hover:translate-x-1`}>
                          {activity.description}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3 transition-all duration-200 group-hover:translate-x-1">
                          <span>{activity.time}</span>
                          {activity.type === 'company' && (
                            <span className="flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              Company
                            </span>
                          )}
                          {activity.type === 'job' && (
                            <span className="flex items-center">
                              <Briefcase className="w-3 h-3 mr-1" />
                              Job
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 mt-1 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110`}>
                  <FileText className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-transform duration-300 hover:scale-125`} />
                </div>
                <h4 className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'} transition-all duration-200 hover:translate-x-1`}>
                  No recent activities
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-all duration-200 hover:translate-x-1`}>
                  Activities will appear here as they occur
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Back to Top Button */}
    {showBackToTop && (
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-white hover:bg-gray-100 text-blue-600'} hover:shadow-xl animate-bounce-slow backdrop-blur-sm`}
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-300 hover:-translate-y-1" />
      </button>
    )}
  </div>
);
};

export default OfficerDashboard;