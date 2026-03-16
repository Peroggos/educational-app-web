import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Home, Users, Settings, School } from 'lucide-react';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch(user?.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'TEACHER':
        return '/teacher/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to={getDashboardLink()} className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">EduApp</span>
              </Link>
              
              <nav className="hidden md:flex space-x-4">
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  <Home size={18} className="inline mr-1" />
                  Главная
                </Link>
                
                <Link to="/subjects" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  <BookOpen size={18} className="inline mr-1" />
                  Предметы
                </Link>

                {user?.role === 'TEACHER' && (
                  <Link to="/teacher/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    <School size={18} className="inline mr-1" />
                    Учительская
                  </Link>
                )}
                
                {user?.role === 'ADMIN' && (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      <Settings size={18} className="inline mr-1" />
                      Админ панель
                    </Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      <Users size={18} className="inline mr-1" />
                      Пользователи
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    {user.name || 'Пользователь'} 
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {user.role === 'ADMIN' ? 'Админ' : 
                       user.role === 'TEACHER' ? 'Учитель' : 'Ученик'}
                    </span>
                  </span>
                  <Link to="/profile" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Users size={20} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};