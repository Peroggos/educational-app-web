import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Users, BookOpen, FileText, Settings, UserPlus, School, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    teachers: 0,
    students: 0,
    subjects: 0,
    tests: 0,
  });

  useEffect(() => {
    // Здесь будет загрузка статистики с сервера
    setStats({
      users: 156,
      teachers: 12,
      students: 144,
      subjects: 8,
      tests: 45,
    });
  }, []);

  const statCards = [
    { icon: Users, label: 'Всего пользователей', value: stats.users, color: 'bg-blue-500' },
    { icon: Users, label: 'Учителей', value: stats.teachers, color: 'bg-green-500' },
    { icon: Users, label: 'Учеников', value: stats.students, color: 'bg-purple-500' },
    { icon: BookOpen, label: 'Предметов', value: stats.subjects, color: 'bg-yellow-500' },
    { icon: FileText, label: 'Тестов', value: stats.tests, color: 'bg-red-500' },
  ];

  const menuItems = [
    {
      title: 'Управление пользователями',
      icon: Users,
      description: 'Добавление, редактирование и удаление пользователей',
      path: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Управление предметами',
      icon: BookOpen,
      description: 'Создание и редактирование предметов',
      path: '/admin/subjects',
      color: 'bg-green-500',
    },
    {
      title: 'Управление тестами',
      icon: FileText,
      description: 'Модерация и управление тестами',
      path: '/admin/tests',
      color: 'bg-purple-500',
    },
    {
      title: 'Статистика',
      icon: Activity,
      description: 'Общая статистика платформы',
      path: '/admin/statistics',
      color: 'bg-yellow-500',
    },
    {
      title: 'Настройки',
      icon: Settings,
      description: 'Настройки платформы',
      path: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="flex items-center space-x-4">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="primary" 
          fullWidth
          onClick={() => navigate('/admin/create-user')}
        >
          <UserPlus size={20} className="mr-2" />
          Создать нового пользователя
        </Button>
        <Button 
          variant="outline" 
          fullWidth
          onClick={() => navigate('/admin/create-subject')}
        >
          <School size={20} className="mr-2" />
          Создать новый предмет
        </Button>
      </div>

      {/* Меню управления */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-start space-x-4">
              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <item.icon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Последние действия */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Последние действия</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-900">Новый пользователь зарегистрирован</p>
                <p className="text-sm text-gray-600">Иван Иванов • 2 часа назад</p>
              </div>
              <span className="text-xs text-gray-500">Только что</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};