import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation();
  
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user:', error);
  }

  console.log('ProtectedRoute check:', { 
    token: token ? 'present' : 'missing',
    userRole: user?.role,
    path: location.pathname 
  });

  if (!token || token === 'undefined' || token === 'null') {
    console.log('No valid token, redirecting to login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  if (location.pathname === '/dashboard') {
    if (user?.role === 'ADMIN') {
      console.log('Admin user, redirecting to admin dashboard');
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'TEACHER') {
      console.log('Teacher user, redirecting to teacher dashboard');
      return <Navigate to="/teacher/dashboard" replace />;
    }
  }

  return <Outlet />;
};