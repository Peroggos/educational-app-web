import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface TestResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
}

export const TestResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as TestResult;

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Результаты не найдены</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          На главную
        </Button>
      </div>
    );
  }

  const percentage = (result.score / result.totalQuestions) * 100;
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Результаты теста
      </h1>

      <Card className="text-center">
        <div className="mb-6">
          {percentage >= 70 ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
          )}
        </div>

        <div className="text-5xl font-bold mb-2">
          {result.score} / {result.totalQuestions}
        </div>
        <p className="text-xl text-gray-600 mb-6">
          {percentage.toFixed(1)}% правильных ответов
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <div className="text-lg font-semibold">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Время</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-lg font-semibold">
              {percentage >= 70 ? 'Сдано' : 'Не сдано'}
            </div>
            <div className="text-sm text-gray-600">Результат</div>
          </div>
        </div>

        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate('/subjects')}>
            К предметам
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            На главную
          </Button>
        </div>
      </Card>
    </div>
  );
};