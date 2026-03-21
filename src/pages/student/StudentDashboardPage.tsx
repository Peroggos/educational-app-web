import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { testsApi } from '../../api/tests.api';
import { progressApi } from '../../api/progress.api'; // Исправлен импорт - было .ipa
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BookOpen, FileText, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import type { SubjectType as Subject } from '../../api/subjects.api';
import type { TestType as Test } from '../../api/tests.api';
import type { OverallProgress } from '../../api/progress.api'; // Исправлен импорт типа

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentTests, setRecentTests] = useState<Test[]>([]);
  const [recommendedTests, setRecommendedTests] = useState<Test[]>([]);
  const [progress, setProgress] = useState<OverallProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем предметы
        const subjectsData = await subjectsApi.getAll();
        setSubjects(subjectsData.slice(0, 6));

        // Загружаем тесты
        const testsData = await testsApi.getAll();
        
        // Случайные тесты для рекомендаций
        const shuffled = [...testsData].sort(() => 0.5 - Math.random());
        setRecommendedTests(shuffled.slice(0, 3));
        
        // Последние тесты
        setRecentTests(testsData.slice(0, 3));

        // Загружаем прогресс - используем правильный метод getMyProgress
        try {
          const progressData = await progressApi.getMyProgress();
          setProgress(progressData);
        } catch (error) {
          console.error('Error loading progress:', error);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Предметов', 
      value: subjects.length.toString(), 
      color: 'bg-blue-500',
      link: '/student/subjects'
    },
    { 
      icon: FileText, 
      label: 'Тестов пройдено', 
      value: progress?.completedTopics?.toString() || '0', 
      color: 'bg-green-500',
      link: '/student/history'
    },
    { 
      icon: TrendingUp, 
      label: 'Средний балл', 
      value: progress?.overallAccuracy ? `${progress.overallAccuracy}%` : '0%', 
      color: 'bg-purple-500',
      link: '/student/progress'
    },
    { 
      icon: Clock, 
      label: 'Часов обучения', 
      value: '12', 
      color: 'bg-yellow-500',
      link: '/student/stats'
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
    <div className="space-y-8">
      {/* Приветствие */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Привет, ученик! 👋</h1>
        <p className="text-gray-600 mt-2">Продолжай учиться и развиваться</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(stat.link)}
          >
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

      {/* Рекомендуемые тесты */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Рекомендуемые тесты</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/student/tests')}>
            Все тесты
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary-600" size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Тест</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {test.questions?.length || 0} вопросов
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{test.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {test.timeLimit || 30} мин
                </span>
                <Button 
                  size="sm" 
                  onClick={() => navigate(`/student/test/${test.id}`)}
                >
                  Начать
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Предметы */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Мои предметы</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/student/subjects')}>
            Все предметы
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="text-center cursor-pointer hover:shadow-lg transition-shadow p-4"
              onClick={() => navigate(`/student/subject/${subject.id}`)}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
              <p className="text-xs text-gray-500">{subject.topics?.length || 0} тем</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Недавние тесты */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Недавние тесты</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/student/history')}>
            История
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {recentTests.map((test) => (
            <Card key={test.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-600">
                  {test.questions?.length || 0} вопросов • {test.timeLimit || 30} минут
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Не начат</span>
                <Button size="sm" onClick={() => navigate(`/student/test/${test.id}`)}>
                  Начать
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};