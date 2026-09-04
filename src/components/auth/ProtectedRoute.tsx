import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../services/authStore';
import type { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ['teacher'],
  children,
}) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full border-4 border-primary-blue/20 border-t-primary-blue animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-700 font-baloo">
          Loading BhashaBridge AI...
        </p>
        <p className="text-xs text-slate-400 mt-1">
          ᱥᱟᱱᱛᱟᱲᱤ ᱟᱨ ᱦᱤᱱᱫᱤ ᱥᱮᱪᱮᱫ
        </p>
      </div>
    );
  }

  // Not logged in -> send to login page
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role not authorized for this specific section
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'teacher') {
      return <Navigate to="/dashboard" replace />;
    }
    if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
