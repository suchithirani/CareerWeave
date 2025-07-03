// components/BackButton.js
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine user type based on current path
  const getUserType = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/hr')) return 'hr';
    if (path.startsWith('/officer')) return 'officer';
    if (path.startsWith('/student')) return 'student';
    return null;
  };

  // Get appropriate dashboard path based on user type
  const getDashboardPath = () => {
    const userType = getUserType();
    switch (userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'hr':
        return '/hr/dashboard';
      case 'officer':
        return '/officer/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  // Get appropriate back button text based on user type
  const getButtonText = () => {
    const userType = getUserType();
    switch (userType) {
      case 'admin':
        return 'Dashboard';
      case 'hr':
        return 'Dashboard';
      case 'officer':
        return 'Dashboard';
      case 'student':
        return 'Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <button 
      onClick={() => navigate(getDashboardPath())}
      className={`group bg-white hover:bg-blue-50 text-blue-600 font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow hover:shadow-md transition-all duration-300 flex items-center space-x-2 border border-blue-100 ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{getButtonText()}</span>
    </button>
  );
};

export default BackButton;