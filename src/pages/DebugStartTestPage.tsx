import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';

export const DebugStartTestPage: React.FC = () => {
  const [testId, setTestId] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testStartEndpoint = async () => {
    if (!testId) {
      toast.error('Введите ID теста');
      return;
    }

    setLoading(true);
    try {
      console.log('Testing /tests/start with testId:', testId);
      
      const res = await apiClient.post('/tests/start', { testId });
      console.log('Success:', res.data);
      setResponse({ success: true, data: res.data });
      toast.success('Тест успешно начат!');
    } catch (error: any) {
      console.error('Error:', {
        response: error.response?.data,
        status: error.response?.status
      });
      setResponse({ 
        success: false, 
        error: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const testGetTest = async () => {
    if (!testId) return;
    
    try {
      const res = await apiClient.get(`/tests/${testId}`);
      setResponse({ getTest: res.data });
      toast.success('Тест найден');
    } catch (error: any) {
      setResponse({ error: error.response?.data });
      toast.error('Тест не найден');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Отладка /tests/start</h1>
      
      <Card className="space-y-4">
        <Input
          label="ID теста"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          placeholder="Введите ID теста"
        />

        <div className="flex space-x-2">
          <Button onClick={testStartEndpoint} loading={loading}>
            Тест /tests/start
          </Button>
          <Button onClick={testGetTest} variant="outline">
            Проверить тест
          </Button>
        </div>

        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
            <pre className="text-xs">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold">Информация:</p>
          <p>• Ожидаемый формат: {"{ testId: 'id' }"}</p>
          <p>• Убедитесь, что тест существует и содержит вопросы</p>
          <p>• Проверьте, что вы авторизованы</p>
        </div>
      </Card>
    </div>
  );
};