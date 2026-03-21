import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressApi, Achievement } from '../../api/progress.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Award, Medal, Star, Target, Zap, Brain, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentAchievementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await progressApi.getAchievements();
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        toast.error('Не удалось загрузить достижения');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getAchievementIcon = (icon: string) => {
    switch(icon) {
      case 'star': return <Star className="text-yellow-500" size={32} />;
      case 'medal': return <Medal className="text-amber-500" size={32} />;
      case 'trophy': return <Award className="text-yellow-500" size={32} />;
      case 'zap': return <Zap className="text-blue-500" size={32} />;
      case 'brain': return <Brain className="text-purple-500" size={32} />;
      default: return <Target className="text-green-500" size={32} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const lockedAchievements = achievements.filter(a => !a.earnedAt);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/student/progress')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад к прогрессу
      </button>

      <h1 className="text-3xl font-bold text-gray-900">Мои достижения</h1>

      {/* Полученные достижения */}
      {earnedAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Полученные ({earnedAchievements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedAchievements.map((achievement) => (
              <Card key={achievement.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-100 to-transparent rounded-bl-full" />
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center">
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    {achievement.earnedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Получено: {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Заблокированные достижения */}
      {lockedAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Заблокированные ({lockedAchievements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="opacity-60 grayscale">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-500">{achievement.name}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">???</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Нет достижений</h3>
          <p className="text-gray-600 mb-4">Пройдите тесты, чтобы получить достижения!</p>
          <Button onClick={() => navigate('/student/tests')}>
            К тестам
          </Button>
        </div>
      )}
    </div>
  );
};