import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  console.log('ProtectedRoute check:', { 
    token: token ? 'present' : 'missing',
    path: location.pathname 
  });

  // Добавим проверку валидности токена
  if (!token || token === 'undefined' || token === 'null') {
    console.log('No valid token, redirecting to login');
    localStorage.removeItem('token'); // Очищаем невалидный токен
    localStorage.removeItem('user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};