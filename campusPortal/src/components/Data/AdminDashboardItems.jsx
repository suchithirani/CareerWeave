import {Users,Building2,Shield,GraduationCap,Briefcase,FileText,Calendar,Award,Bell,BarChart3, HelpCircleIcon} from 'lucide-react'
export const dashboardItems = [
    {
      title: 'Register New HR/ Officer',
      description: 'Create new HR or officer accounts',
      icon: Users,
      path: '/admin/register',
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-600 hover:to-cyan-700',
      category: 'User Management'
    },
    {
      title: 'Manage Users',
      description: 'Add, edit, and manage user accounts',
      icon: Users,
      path: '/admin/users',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      category: 'User Management'
    },
    {
      title: 'Manage Companies',
      description: 'Company registrations and profiles',
      icon: Building2,
      path: '/admin/companies',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      category: 'Company Management'
    },
    {
      title: 'Placement Officer',
      description: 'View all officers and profiles',
      icon: Shield,
      path: '/admin/officers',
      color: 'from-rose-500 to-rose-600',
      hoverColor: 'hover:from-rose-600 hover:to-rose-700',
      category: 'User Management'
    },
    {
      title: 'Student Profiles',
      description: 'View and manage student information',
      icon: GraduationCap,
      path: '/admin/student-profiles',
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700',
      category: 'Academic'
    },
    {
      title: 'Job Openings',
      description: 'Monitor and manage job postings',
      icon: Briefcase,
      path: '/admin/jobs',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      category: 'Job Management'
    },
    {
      title: 'Applications',
      description: 'Review and track job applications',
      icon: FileText,
      path: '/admin/applications',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      category: 'Application Management'
    },
    {
      title: 'Interview Schedules',
      description: 'Manage interview appointments',
      icon: Calendar,
      path: '/admin/interviews',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700',
      category: 'Scheduling'
    },
    {
      title: 'All Offers',
      description: 'View all offers',
      icon: Award,
      path: '/admin/offers',
      color: 'from-sky-500 to-sky-600',
      hoverColor: 'hover:from-sky-600 hover:to-sky-700',
      category: 'Offer Management'
    },
    {
      title: 'Notifications',
      description: 'Send and manage system notifications',
      icon: Bell,
      path: '/admin/notifications',
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      category: 'Communication'
    },
    {
      title: 'Analytics',
      description: 'View platform statistics and reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      category: 'Analytics'
    },
    {
      title: 'Help Center',
      description: 'View and update',
      icon: HelpCircleIcon,
      path: '/admin/help',
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      category: 'Help'
    },
    {
      title: 'Feedback Center',
      description: 'View and update',
      icon: HelpCircleIcon,
      path: '/admin/feedback',
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-600 hover:to-cyan-700',
      category: 'Help'
    },
    

  ];