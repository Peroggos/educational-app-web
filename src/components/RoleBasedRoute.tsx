import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../types/user.types';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  allowedRoles, 
  redirectTo = '/dashboard' 
}) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  console.log('RoleBasedRoute check:', { 
    userRole: user?.role, 
    allowedRoles,
    hasAccess: user && allowedRoles.includes(user.role)
  });

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};