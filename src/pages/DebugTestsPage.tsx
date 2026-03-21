import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';

export const DebugTestsPage: React.FC = () => {
  const [testId, setTestId] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkTestEndpoints = async () => {
    if (!testId) {
      toast.error('Введите ID теста');
      return;
    }

    setLoading(true);
    const results: any = {};

    try {
      // Проверяем GET /tests/:id
      try {
        const getTest = await apiClient.get(`/tests/${testId}`);
        results.getTest = { status: getTest.status, data: getTest.data };
      } catch (error: any) {
        results.getTest = { error: error.response?.status, message: error.message };
      }

      // Проверяем GET /tests/:id/questions
      try {
        const getQuestions = await apiClient.get(`/tests/${testId}/questions`);
        results.getQuestions = { status: getQuestions.status, data: getQuestions.data };
      } catch (error: any) {
        results.getQuestions = { error: error.response?.status, message: error.message };
      }

      // Проверяем POST /tests/:id/submit
      try {
        const submitTest = await apiClient.post(`/tests/${testId}/submit`, {
          answers: [{ questionId: 'test', selectedOption: 0 }]
        });
        results.submitTest = { status: submitTest.status, data: submitTest.data };
      } catch (error: any) {
        results.submitTest = { error: error.response?.status, message: error.message };
      }

      // Проверяем POST /tests/:id/start
      try {
        const startTest = await apiClient.post(`/tests/${testId}/start`);
        results.startTest = { status: startTest.status, data: startTest.data };
      } catch (error: any) {
        results.startTest = { error: error.response?.status, message: error.message };
      }

      // Проверяем GET /tests/results/my
      try {
        const myResults = await apiClient.get('/tests/results/my');
        results.myResults = { status: myResults.status, data: myResults.data };
      } catch (error: any) {
        results.myResults = { error: error.response?.status, message: error.message };
      }

      setResponse(results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Отладка API тестов</h1>
      
      <Card className="space-y-4">
        <Input
          label="ID теста"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          placeholder="Введите ID теста"
        />

        <Button onClick={checkTestEndpoints} loading={loading}>
          Проверить эндпоинты
        </Button>

        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
            <pre className="text-xs">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
};