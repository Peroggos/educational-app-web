import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressApi, OverallProgress, UserStats, Achievement } from '../../api/progress.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TrendingUp, Award, Clock, Target, Trophy, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<OverallProgress | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressData, statsData, achievementsData] = await Promise.all([
          progressApi.getMyProgress(),
          progressApi.getStats(),
          progressApi.getAchievements()
        ]);
        
        setProgress(progressData);
        setStats(statsData);
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        toast.error('Не удалось загрузить данные прогресса');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkAchievements = async () => {
    try {
      const newAchievements = await progressApi.checkAchievements();
      if (newAchievements.length > 0) {
        toast.success(`Получено ${newAchievements.length} новых достижений!`);
        setAchievements([...achievements, ...newAchievements]);
      } else {
        toast.success('Новых достижений пока нет'); // Изменено с toast.info на toast.success
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      toast.error('Ошибка при проверке достижений');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getRankColor = (rank?: number) => {
    if (!rank) return 'text-gray-600';
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-600';
  };

  const getRankIcon = (rank?: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (rank === 2) return <Trophy className="text-gray-400" size={24} />;
    if (rank === 3) return <Trophy className="text-amber-600" size={24} />;
    return <Target className="text-gray-500" size={24} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Мой прогресс</h1>
        <Button onClick={checkAchievements} variant="outline" size="sm">
          <Award size={18} className="mr-2" />
          Проверить достижения
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4">
          <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <Target className="text-white" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{progress?.totalTopics || 0}</p>
            <p className="text-gray-600">Всего тем</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{progress?.overallAccuracy || 0}%</p>
            <p className="text-gray-600">Средняя точность</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <Award className="text-white" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
            <p className="text-gray-600">Достижений</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <Clock className="text-white" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.streak || 0}</p>
            <p className="text-gray-600">Дней подряд</p>
          </div>
        </Card>
      </div>

      {/* Детальная статистика */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Детальная статистика</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Всего тестов</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalTests || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Средний балл</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.averageScore || 0}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Время обучения</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor((stats?.totalTime || 0) / 60)} ч
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Рейтинг</p>
            <div className="flex items-center justify-center space-x-1">
              {getRankIcon(stats?.rank)}
              <p className={`text-2xl font-bold ${getRankColor(stats?.rank)}`}>
                #{stats?.rank || '—'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Прогресс по темам */}
      {progress?.topicsProgress && progress.topicsProgress.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Прогресс по темам</h2>
          <div className="space-y-3">
            {progress.topicsProgress.map((topic) => (
              <Card key={topic.topicId} className="hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{topic.topicName}</h3>
                    <p className="text-sm text-gray-500">{topic.subjectName}</p>
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    {topic.accuracy}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 rounded-full transition-all duration-300"
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Правильно: {topic.correctAnswers}</span>
                  <span>Всего: {topic.questionsAnswered}</span>
                  <span>Последнее: {new Date(topic.lastPracticed).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Достижения */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Мои достижения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement) => (
              <Card key={achievement.id} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  {achievement.earnedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Получено: {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
          {achievements.length > 6 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => navigate('/student/achievements')}>
                Посмотреть все достижения ({achievements.length})
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Кнопки навигации */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => navigate('/student')}>
          На главную
        </Button>
        <Button onClick={() => navigate('/student/tests')}>
          К тестам
        </Button>
      </div>
    </div>
  );
};