import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsApi } from '../api/subjects.api';
import { testsApi } from '../api/tests.api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { BookOpen, TrendingUp, Clock, Award } from 'lucide-react';
import type { SubjectType as Subject } from '../api/subjects.api';
import type { TestType as Test } from '../api/tests.api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data...');
        
        // Убираем вызов getProgress, так как его нет
        const [subjectsData, testsData] = await Promise.all([
          subjectsApi.getAll(),
          testsApi.getAll(),
        ]);
        
        console.log('Data fetched:', { 
          subjects: subjectsData, 
          tests: testsData
        });
        
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        setTests(Array.isArray(testsData) ? testsData : []);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Ошибка загрузки данных');
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Повторить
        </Button>
      </div>
    );
  }

  // Статистика с проверкой на наличие данных
  const stats = [
    { 
      icon: BookOpen, 
      label: 'Предметы', 
      value: subjects.length.toString(), 
      color: 'bg-blue-500' 
    },
    { 
      icon: TrendingUp, 
      label: 'Прогресс', 
      value: '0%', 
      color: 'bg-green-500' 
    },
    { 
      icon: Clock, 
      label: 'Тестов завершено', 
      value: '0', 
      color: 'bg-purple-500' 
    },
    { 
      icon: Award, 
      label: 'Всего тестов', 
      value: tests.length.toString(), 
      color: 'bg-yellow-500' 
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center space-x-4">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Subjects */}
      {subjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Предметы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{subject.description}</p>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                  fullWidth
                >
                  Подробнее
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tests */}
      {tests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Доступные тесты</h2>
          <div className="space-y-3">
            {tests.slice(0, 3).map((test) => (
              <Card key={test.id} className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-gray-600">
                    {test.questions?.length || 0} вопросов
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/tests/${test.id}`)}
                >
                  Начать
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No data message */}
      {subjects.length === 0 && tests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Нет доступных данных</p>
        </div>
      )}
    </div>
  );
};