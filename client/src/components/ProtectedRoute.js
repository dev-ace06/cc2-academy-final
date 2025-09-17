import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-coc-gray-600 dark:text-coc-gray-400 mb-6">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-coc-gray-500 dark:text-coc-gray-500">
              Required roles: {requiredRoles.join(', ')}
            </p>
            <p className="text-sm text-coc-gray-500 dark:text-coc-gray-500">
              Your role: {user.role}
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;









