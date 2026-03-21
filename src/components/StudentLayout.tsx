import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, FileText, Home, History, User, LogOut, BarChart } from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  };

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigation = [
    { name: 'Главная', href: '/student', icon: Home },
    { name: 'Предметы', href: '/student/subjects', icon: BookOpen },
    { name: 'Тесты', href: '/student/tests', icon: FileText },
    { name: 'Прогресс', href: '/student/progress', icon: BarChart },
    { name: 'История', href: '/student/history', icon: History },
    { name: 'Профиль', href: '/student/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Верхняя навигация */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">EduApp</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-b-2 border-primary-500 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="mr-2" size={16} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};