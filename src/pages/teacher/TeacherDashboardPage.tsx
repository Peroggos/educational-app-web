import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { testsApi } from '../../api/tests.api';
import { lessonsApi } from '../../api/lessons.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Users, BookOpen, FileText, PlusCircle, 
  Edit, Trash2, TrendingUp, Award, Clock,
  BarChart, GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Test as Test } from '../../api/tests.api';

export const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTests: 0,
    totalLessons: 0,
    averageScore: 0,
    completedTests: 0
  });
  const [recentTests, setRecentTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные (без users, так как у учителя нет прав)
        const [subjectsData, testsData, lessonsData] = await Promise.all([
          subjectsApi.getAll(),
          testsApi.getAll(),
          lessonsApi.getAll()
        ]);

        setSubjects(subjectsData);
        setTests(testsData);
        setLessons(lessonsData);

        // Получаем статистику (временно используем демо-данные)
        let totalScore = 0;
        let scoreCount = 0;
        let completedTests = 0;

        for (const test of testsData) {
          // Временно используем мок-данные для статистики
          completedTests += Math.floor(Math.random() * 10);
          totalScore += completedTests * 75;
          scoreCount += completedTests;
        }

        const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

        setStats({
          totalStudents: 0, // Временно 0, пока нет прав
          totalTests: testsData.length,
          totalLessons: lessonsData.length,
          averageScore,
          completedTests
        });

        // Последние тесты
        setRecentTests(testsData.slice(0, 5));

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTest = async (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить тест "${name}"?`)) {
      try {
        await testsApi.delete(id);
        toast.success(`Тест "${name}" удален`);
        setTests(tests.filter(t => t.id !== id));
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Ошибка при удалении теста');
      }
    }
  };

  const statCards = [
    { 
      icon: FileText, 
      label: 'Создано тестов', 
      value: stats.totalTests, 
      color: 'bg-green-500',
      subValue: `${stats.completedTests} пройдено`,
      link: '/teacher/tests'
    },
    { 
      icon: BookOpen, 
      label: 'Создано уроков', 
      value: stats.totalLessons, 
      color: 'bg-purple-500',
      subValue: `${subjects.length} предметов`,
      link: '/teacher/lessons'
    },
    { 
      icon: TrendingUp, 
      label: 'Средний балл', 
      value: `${stats.averageScore}%`, 
      color: 'bg-yellow-500',
      subValue: 'по всем тестам',
      link: '/teacher/statistics'
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Панель учителя</h1>
          <p className="text-gray-600 mt-1">Управление учебными материалами и отслеживание прогресса</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => navigate('/teacher/create-lesson')}>
            <PlusCircle size={20} className="mr-2" />
            Создать урок
          </Button>
          <Button onClick={() => navigate('/teacher/create-test')}>
            <PlusCircle size={20} className="mr-2" />
            Создать тест
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(stat.link)}
          >
            <div className="flex items-center space-x-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.subValue}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Предметы */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Мои предметы</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/teacher/create-topic')}
            >
              <PlusCircle size={16} className="mr-1" />
              Добавить тему
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/teacher/subjects')}
            >
              Управление предметами
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.slice(0, 8).map((subject) => (
            <Card 
              key={subject.id} 
              className="text-center cursor-pointer hover:shadow-lg transition-shadow p-4"
              onClick={() => navigate(`/teacher/subject/${subject.id}`)}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
              <p className="text-xs text-gray-500">
                {subject.topics?.length || 0} тем
              </p>
            </Card>
          ))}
        </div>
        {subjects.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-gray-500">У вас пока нет предметов</p>
            <div className="flex justify-center space-x-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/create-subject')}>
                Создать предмет
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/teacher/create-topic')}>
                Добавить тему
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Мои тесты */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Мои тесты</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/teacher/tests')}>
            Все тесты
          </Button>
        </div>
        <div className="space-y-3">
          {recentTests.map((test) => (
            <Card key={test.id} className="flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <FileText className="text-green-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-500">
                      {test.questions?.length || 0} вопросов • {test.timeLimit || 30} минут
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/teacher/edit-test/${test.id}`)}
                >
                  <Edit size={16} className="mr-1" />
                  Редактировать
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteTest(test.id, test.name)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
          {tests.length === 0 && (
            <Card className="text-center py-8">
              <p className="text-gray-500">У вас пока нет тестов</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/teacher/create-test')}>
                Создать первый тест
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Последние уроки */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Последние уроки</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/teacher/lessons')}>
            Все уроки
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lessons.slice(0, 4).map((lesson) => (
            <Card key={lesson.id} className="flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <BookOpen className="text-primary-600" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                  <p className="text-xs text-gray-500">
                    {lesson.duration || 30} минут • Порядок: {lesson.order}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/teacher/lessons/${lesson.id}`)}
              >
                Просмотр
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/teacher/statistics')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Статистика</h3>
              <p className="text-sm text-gray-600">Анализ успеваемости</p>
              <p className="text-xs text-gray-400">Средний балл: {stats.averageScore}%</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/teacher/achievements')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="text-yellow-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Достижения</h3>
              <p className="text-sm text-gray-600">Ваши успехи</p>
              <p className="text-xs text-gray-400">Продолжайте в том же духе!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};