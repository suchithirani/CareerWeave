import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from './utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  try {
    const role = getUserRole();
    if (!role) {
      return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    // Optionally render fallback UI
    return <div>Something went wrong in ProtectedRoute.</div>;
  }
};

export default ProtectedRoute;
