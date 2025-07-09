import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  ChevronRight,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
  Menu,
  X,
  ArrowUp,
  Shield,
  GraduationCap,
  Building2,
  Activity,
  Eye,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const HrDashboard = () => {
  const navigate = useNavigate();
    const jobId = localStorage.getItem("selectedJobId");
  const [dashboardData, setDashboardData] = useState({
    applications: [],
    jobOpenings: [],
    interviews: [],
    candidates: [],
    jobApplications: [],
    loading: true,
    error: null
  });

  

  const [stats, setStats] = useState({
    totalApplications: 0,
    activeJobs: 0,
    upcomingInterviews: 0,
    newCandidates: 0,
    jobSpecificApplications: 0,
    pendingOffers: 0
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

  const hrDashboardItems = [
    {
      title: 'Update Profile',
      description: 'Update your HR profile information',
      icon: Shield,
      path: '/hr/profile',
      color: 'from-stone-500 to-stone-600',
      hoverColor: 'hover:from-stone-600 hover:to-stone-700',
      category: 'Profile'
    },
    {
      title: 'Post New Job',
      description: 'Create and publish new job openings',
      icon: Briefcase,
      path: '/hr/jobs/new',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      category: 'Jobs'
    },
    {
      title: 'Applications',
      description: 'Review and process job applications',
      icon: FileText,
      path: jobId ? `/hr/applications/${jobId}` : '/hr/applications',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      category: 'Applications'
    },
    {
      title: 'Candidate Pool',
      description: 'View all potential candidates',
      icon: Users,
      path: '/hr/candidates',
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700',
      category: 'Candidates'
    },
    {
      title: 'Interview Schedule',
      description: 'Manage upcoming interviews',
      icon: Calendar,
      path: '/hr/interviews',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700',
      category: 'Interviews'
    },
    {
      title: 'Hiring Pipeline',
      description: 'Track candidates through stages',
      icon: ClipboardCheck,
      path: `/hr/pipeline/${jobId}`,
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      category: 'Hiring'
    },
    {
      title: 'Send Offers',
      description: 'Create and send job offers',
      icon: Mail,
      path: '/hr/offers',
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      category: 'Offers'
    },
    {
      title: 'Onboarding',
      description: 'Manage new hire onboarding',
      icon: UserPlus,
      path: '/hr/onboarding',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      category: 'Onboarding'
    },
    {
      title: 'Notifications',
      description: 'View your notifications',
      icon: Bell,
      path: '/hr/notifications',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      category: 'Communication'
    },
    {
      title: 'Help',
      description: 'View your notifications',
      icon: HelpCircle,
      path: '/hr/help',
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      category: 'Help'
    },
    {
      title: 'Feedback',
      description: 'View and write Feedback',
      icon: HelpCircle,
      path: '/hr/feedback',
      color: 'from-sky-500 to-sky-600',
      hoverColor: 'hover:from-sky-600 hover:to-sky-700',
      category: 'Help'
    }
    
  ];

  // Group dashboard items by category
  const groupedItems = hrDashboardItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);

  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const selectedJobId =
      jobId && jobId !== "null" && jobId !== "undefined" ? jobId : null;
      const token = localStorage.getItem('token') || '';
      
      const endpoints = [
        { 
          url: `http://localhost:8080/api/job-applications/hr`, 
          key: 'applications',
          errorMessage: 'Failed to load applications'
        },
        { 
          url: `http://localhost:8080/api/job-openings/HR`, 
          key: 'jobOpenings',
          errorMessage: 'Failed to load job openings'
        },
        { 
          url: `http://localhost:8080/api/interview-schedules/hr`, 
          key: 'interviews',
          errorMessage: 'Failed to load interviews'
        },
        { 
          url: `http://localhost:8080/api/student/profile/admin/all`, 
          key: 'candidates',
          errorMessage: 'Failed to load candidates'
        },
        { 
          url: jobId ? 
            `http://localhost:8080/api/job-applications/job/${jobId}` : null,
          key: 'jobApplications',
          errorMessage: 'Failed to load job-specific applications'
        },
        {
          url: `http://localhost:8080/api/job-offers/hr`,
          key: 'pendingOffers',
          errorMessage: 'Failed to load pending offers'
        }
      ];

      const results = {};
      let hasError = false;
      
      for (const endpoint of endpoints) {
        if (!endpoint.url) continue;
        
        try {
          const response = await fetch(endpoint.url, {
            headers: {
              'Authorization': `Bearer ${token}`
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
      
      // Update dashboard data
      setDashboardData({
        applications: results.applications || [],
        jobOpenings: results.jobOpenings || [],
        interviews: results.interviews || [],
        candidates: results.candidates || [],
        jobApplications: results.jobApplications || [],
        pendingOffers: results.pendingOffers || [],
        loading: false,
        error: null
      });

      // Calculate statistics with robust date handling
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const upcomingInterviews = results.interviews?.filter(interview => {
        try {
          const interviewDate = interview.interviewDateTime || interview.scheduledTime || interview.date;
          if (!interviewDate) return false;
          const date = new Date(interviewDate);
          return !isNaN(date.getTime()) && date > now;
        } catch {
          return false;
        }
      }) || [];

      setStats({
        totalApplications: results.applications?.length || 0,
        activeJobs: results.jobOpenings?.length || 0,
        upcomingInterviews: upcomingInterviews.length,
        newCandidates: results.candidates?.filter(candidate => {
          try {
            const candidateDate = candidate.createdAt || candidate.applicationDate || candidate.dateAdded;
            return candidateDate && new Date(candidateDate) > oneWeekAgo;
          } catch {
            return false;
          }
        }).length || 0,
        jobSpecificApplications: results.jobApplications?.length || 0,
        pendingOffers: results.pendingOffers?.filter(offer => offer.status === 'PENDING').length || 0
      });

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load HR dashboard data'
      }));
    }
  };

  const getRecentActivities = () => {
    const activities = [];
    const now = new Date();
    
    // Candidate activities (non-clickable)
    if (dashboardData.candidates?.length > 0) {
      const recentCandidates = dashboardData.candidates
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.applicationDate || a.dateAdded || 0);
          const dateB = new Date(b.createdAt || b.applicationDate || b.dateAdded || 0);
          return dateB - dateA;
        })
        .slice(0, 2);
      
      recentCandidates.forEach(candidate => {
        activities.push({
          type: 'candidate',
          icon: Users,
          title: 'New Candidate',
          description: `New candidate: ${candidate.name || candidate.fullName || candidate.email || 'Candidate'}`,
          time: formatTimeAgo(candidate.createdAt || candidate.applicationDate || candidate.dateAdded),
          bgColor: 'bg-yellow-400/20',
          iconColor: 'text-yellow-400',
          timestamp: new Date(candidate.createdAt || candidate.applicationDate || candidate.dateAdded || 0),
          // Removed candidateId to prevent click behavior
          isStatic: true // Mark as non-clickable
        });
      });
    }

    // Interview activities (clickable)
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
          description: `Interview with ${interview.candidateName || interview.candidate || 'Candidate'}`,
          time: formatInterviewTime(interview.dateTime || interview.scheduledTime || interview.date),
          bgColor: 'bg-pink-400/20',
          iconColor: 'text-pink-400',
          timestamp: new Date(interview.dateTime || interview.scheduledTime || interview.date || 0),
          interviewId: interview.id || interview._id || null
        });
      });
    }

    // Application activities (clickable)
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
          description: `${app.applicantName || 'Applicant'} applied`,
          time: formatTimeAgo(app.createdAt || app.appliedDate),
          bgColor: 'bg-green-400/20',
          iconColor: 'text-green-400',
          timestamp: new Date(app.createdAt || app.appliedDate || 0),
          applicationId: app.id || app._id || null
        });
      });
    }

    // Job activities (clickable)
    if (dashboardData.jobOpenings?.length > 0) {
      const recentJobs = dashboardData.jobOpenings
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.postedDate || 0);
          const dateB = new Date(b.createdAt || b.postedDate || 0);
          return dateB - dateA;
        })
        .slice(0, 1);
      
      recentJobs.forEach(job => {
        activities.push({
          type: 'job',
          icon: Briefcase,
          title: 'Job Posted',
          description: `New job: ${job.title || job.position}`,
          time: formatTimeAgo(job.createdAt || job.postedDate),
          bgColor: 'bg-purple-400/20',
          iconColor: 'text-purple-400',
          timestamp: new Date(job.createdAt || job.postedDate || 0),
          jobId: job.id || job._id || null
        });
      });
    }

    // Offer activities (clickable)
    if (dashboardData.pendingOffers?.length > 0) {
      const recentOffers = dashboardData.pendingOffers
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.offerDate || 0);
          const dateB = new Date(b.createdAt || b.offerDate || 0);
          return dateB - dateA;
        })
        .slice(0, 1);
      
      recentOffers.forEach(offer => {
        activities.push({
          type: 'offer',
          icon: Mail,
          title: 'Pending Offer',
          description: `Offer sent to ${offer.candidateName || 'Candidate'}`,
          time: formatTimeAgo(offer.createdAt || offer.offerDate),
          bgColor: 'bg-teal-400/20',
          iconColor: 'text-teal-400',
          timestamp: new Date(offer.createdAt || offer.offerDate || 0),
          offerId: offer.id || offer._id || null
        });
      });
    }

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);
  };

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
    localStorage.removeItem('companyId');
    localStorage.removeItem('jobId');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/job-offers/${offerId}/${action.toLowerCase()}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} offer`);
      }
      
      toast.success(`Offer ${action.toLowerCase()}ed successfully`);
      fetchDashboardData();
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error);
      toast.error(error.message || `Failed to ${action} offer`);
    }
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || role !== 'COMPANY_HR') {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [navigate, jobId]);

  const recentActivities = getRecentActivities();
  const hrName = localStorage.getItem('name') || 'HR Manager';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold dark:text-white">HR Panel</span>
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
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Activity className="w-3 h-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-5xl font-black bg-gradient-to-r ${darkMode ? 'from-gray-100 via-blue-100 to-purple-100' : 'from-gray-900 via-blue-900 to-purple-900'} bg-clip-text text-transparent mb-3`}>
                    HR Dashboard
                  </h1>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xl font-medium`}>Welcome back, {hrName}</p>
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
                title: 'Total Applications',
                value: stats.totalApplications,
                icon: FileText,
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
                title: 'Upcoming Interviews',
                value: stats.upcomingInterviews,
                icon: Calendar,
                color: 'from-orange-500 to-yellow-500',
                bgPattern: darkMode ? 'bg-gray-800' : 'bg-orange-50',
                growth: '+24%'
              },
              {
                title: 'Pending Offers',
                value: stats.pendingOffers,
                icon: Mail,
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
         <div className="mt-16 rounded-2xl shadow-xl border overflow-hidden ${
  darkMode 
    ? 'bg-gray-800/60 backdrop-blur-sm border-gray-700' 
    : 'bg-white/60 backdrop-blur-sm border-white/50'
}">
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
        <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Real-time updates from your recruitment process
        </p>
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
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-500 dark:text-gray-400">Loading activities...</span>
        </div>
      </div>
    ) : recentActivities.length > 0 ? (
      <div className="space-y-4">
        {recentActivities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div
              key={index}
              onClick={() => {
                if (activity.type === 'candidate') {
                  handleNavigation(activity.candidateId ? `/hr/candidates/${activity.candidateId}` : '/hr/candidates');
                } else if (activity.type === 'interview') {
                  handleNavigation(activity.interviewId ? `/hr/interviews/${activity.interviewId}` : '/hr/interviews');
                } else if (activity.type === 'application') {
                  handleNavigation(activity.applicationId ? `/hr/applications/view/${activity.applicationId}` : '/hr/applications');
                } else if (activity.type === 'job') {
                  handleNavigation(activity.jobId ? `/hr/jobs/${activity.jobId}` : '/hr/jobs/new');
                } else if (activity.type === 'offer') {
                  handleNavigation(activity.offerId ? `/hr/offers/${activity.offerId}` : '/hr/offers');
                }
              }}
              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                darkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`p-3 rounded-lg ${activity.bgColor} mr-4`}>
                <IconComponent className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold mb-1 truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {activity.title}
                </h4>
                <p className={`text-sm truncate ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {activity.description}
                </p>
              </div>
              <div className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-12">
        <FileText className={`w-8 h-8 mx-auto mb-3 ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <p className={`${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          No recent activities to display
        </p>
      </div>
    )}
  </div>
</div>


{/* Quick Actions Footer */}
<div className="mt-12 flex flex-wrap gap-3">
  <button
    onClick={() => handleNavigation('/hr/jobs/new')}
    className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
      darkMode 
        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
        : 'bg-blue-500 hover:bg-blue-400 text-white'
    }`}
  >
    <Briefcase className="w-5 h-5 mr-2" />
    Post New Job
  </button>
  <button
    onClick={() => handleNavigation('/hr/interviews')}
    className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }`}
  >
    <Calendar className="w-5 h-5 mr-2" />
    Schedule Interview
  </button>
  <button
    onClick={() => handleNavigation('/hr/offers')}
    className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }`}
  >
    <Mail className="w-5 h-5 mr-2" />
    Create Offer
  </button>
  <button
    onClick={() => handleNavigation('/hr/notifications')}
    className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }`}
  >
    <BarChart3 className="w-5 h-5 mr-2" />
    View Notifications
  </button>
</div>

{/* Back to Top Button */}
{showBackToTop && (
  <button
    onClick={scrollToTop}
    className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
        : 'bg-white hover:bg-gray-100 text-gray-700'
    }`}
  >
    <ArrowUp className="w-5 h-5" />
  </button>
)}


</div>
      </div>
    </div>
  );
};

export default HrDashboard;