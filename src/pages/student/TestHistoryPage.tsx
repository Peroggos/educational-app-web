import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../../api/tests.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Clock, Award, ChevronRight } from 'lucide-react';
import type { TestResultType as TestResult } from '../../api/tests.api';

export const TestHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await testsApi.getMyResults();
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Дата неизвестна';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">История тестов</h1>

      {results.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Нет пройденных тестов</h3>
            <p className="text-gray-600 mb-4">Вы еще не прошли ни одного теста</p>
            <Button onClick={() => navigate('/student/tests')}>
              Перейти к тестам
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((result) => {
            const score = result.score || 0;
            const total = result.totalQuestions || 1;
            const percentage = Math.round((score / total) * 100);
            
            return (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.test?.name || 'Тест'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {result.completedAt ? 'Завершен' : 'В процессе'}
                      </span>
                      <span>{formatDate(result.completedAt)}</span>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      Правильно: {score} из {total}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/test-result/${result.testId}`, { state: { result } })}
                  >
                    Подробнее
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};