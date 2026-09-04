import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../services/authStore';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated && role) {
    if (role === 'teacher') {
      return <Navigate to="/dashboard" replace />;
    }
    if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};
