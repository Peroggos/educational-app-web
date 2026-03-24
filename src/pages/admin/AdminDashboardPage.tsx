import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { testsApi } from '../../api/tests.api';
import { usersApi } from '../../api/users.api';
import { lessonsApi } from '../../api/lessons.api';
import { questionsApi } from '../../api/questions.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Users, BookOpen, FileText, Settings, 
  UserPlus, School, Activity, TrendingUp 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total: 0, teachers: 0, students: 0, admins: 0 },
    subjects: 0,
    topics: 0,
    tests: 0,
    lessons: 0,
    questions: 0,
    completedTests: 0,
    averageScore: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Получаем все данные параллельно
        const [subjectsData, testsData, usersData, lessonsData, questionsData] = await Promise.all([
          subjectsApi.getAll(),
          testsApi.getAll(),
          usersApi.getAll(),
          lessonsApi.getAll(),
          questionsApi.getAll()
        ]);

        // Подсчитываем статистику
        const teachers = usersData.filter(u => u.role === 'TEACHER').length;
        const students = usersData.filter(u => u.role === 'STUDENT').length;
        const admins = usersData.filter(u => u.role === 'ADMIN').length;

        // Получаем темы
        let totalTopics = 0;
        for (const subject of subjectsData) {
          const topics = await subjectsApi.getTopics(subject.id);
          totalTopics += topics.length;
        }

        // Получаем результаты тестов (используем getMyResults для демо)
        let totalCompletedTests = 0;
        let totalScore = 0;
        let scoreCount = 0;
        
        // Временно используем мок-данные для статистики
        // В реальном приложении нужно добавить эндпоинт для получения всех результатов
        totalCompletedTests = testsData.length * 2; // Для демо
        totalScore = totalCompletedTests * 75;
        scoreCount = totalCompletedTests;

        const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

        setStats({
          users: {
            total: usersData.length,
            teachers,
            students,
            admins
          },
          subjects: subjectsData.length,
          topics: totalTopics,
          tests: testsData.length,
          lessons: lessonsData.length,
          questions: questionsData.length,
          completedTests: totalCompletedTests,
          averageScore,
          activeUsers: students
        });

        // Создаем последние активности
        setRecentActivities([
          { type: 'user', action: 'Новый пользователь зарегистрирован', time: '5 минут назад', icon: UserPlus },
          { type: 'test', action: 'Тест пройден', time: '1 час назад', icon: Activity },
          { type: 'subject', action: 'Добавлен новый предмет', time: '3 часа назад', icon: BookOpen },
        ]);

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      icon: Users, 
      label: 'Всего пользователей', 
      value: stats.users.total, 
      color: 'bg-blue-500',
      details: `👨‍🏫 Учителей: ${stats.users.teachers} | 👨‍🎓 Учеников: ${stats.users.students}`
    },
    { 
      icon: BookOpen, 
      label: 'Предметов', 
      value: stats.subjects, 
      color: 'bg-green-500',
      details: `Тем: ${stats.topics}`
    },
    { 
      icon: FileText, 
      label: 'Тестов', 
      value: stats.tests, 
      color: 'bg-purple-500',
      details: `Пройдено: ${stats.completedTests}`
    },
    { 
      icon: Activity, 
      label: 'Средний балл', 
      value: `${stats.averageScore}%`, 
      color: 'bg-yellow-500',
      details: 'По всем тестам'
    },
    { 
      icon: School, 
      label: 'Уроков', 
      value: stats.lessons, 
      color: 'bg-red-500',
      details: 'Всего уроков'
    },
    { 
      icon: TrendingUp, 
      label: 'Вопросов', 
      value: stats.questions, 
      color: 'bg-indigo-500',
      details: 'В базе данных'
    },
  ];

  const menuItems = [
    {
      title: 'Управление пользователями',
      icon: Users,
      description: 'Добавление, редактирование и удаление пользователей',
      path: '/admin/users',
      color: 'bg-blue-500',
      count: stats.users.total
    },
    {
      title: 'Управление предметами',
      icon: BookOpen,
      description: 'Создание и редактирование предметов',
      path: '/admin/subjects',
      color: 'bg-green-500',
      count: stats.subjects
    },
    {
      title: 'Управление тестами',
      icon: FileText,
      description: 'Модерация и управление тестами',
      path: '/admin/tests',
      color: 'bg-purple-500',
      count: stats.tests
    },
    {
      title: 'Управление уроками',
      icon: School,
      description: 'Просмотр и управление уроками',
      path: '/admin/lessons',
      color: 'bg-red-500',
      count: stats.lessons
    },
    {
      title: 'Статистика',
      icon: Activity,
      description: 'Общая статистика платформы',
      path: '/admin/statistics',
      color: 'bg-yellow-500'
    },
    {
      title: 'Настройки',
      icon: Settings,
      description: 'Настройки платформы',
      path: '/admin/settings',
      color: 'bg-gray-500'
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
        <p className="text-gray-600 mt-1">Добро пожаловать в панель управления платформой</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
                {stat.details && (
                  <p className="text-xs text-gray-400 mt-1">{stat.details}</p>
                )}
              </div>
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
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.count !== undefined && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
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
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <activity.icon className="text-gray-500" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">Только что</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Прогресс платформы */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Прогресс платформы</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Контент</span>
              <span className="text-gray-600">
                {stats.lessons + stats.tests + stats.questions} ед.
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${Math.min(100, (stats.lessons + stats.tests + stats.questions) / 10)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Пользователи</span>
              <span className="text-gray-600">{stats.users.total}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${Math.min(100, stats.users.total / 2)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Активность</span>
              <span className="text-gray-600">{stats.completedTests} тестов пройдено</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${Math.min(100, stats.completedTests / 5)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};