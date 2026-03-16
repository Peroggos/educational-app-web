import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const TestApiPage: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/health');
      setStatus(`✅ Сервер доступен: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setStatus(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      setStatus(`✅ Логин успешен: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setStatus(`❌ Ошибка: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Тест API соединения</h1>
        
        <div className="space-y-4 mb-6">
          <Button onClick={testHealth} loading={loading}>
            Проверить health
          </Button>
          
          <Button onClick={testLogin} loading={loading}>
            Тестовый вход
          </Button>
        </div>

        {status && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <pre className="whitespace-pre-wrap">{status}</pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p>API URL: http://localhost:3000/api</p>
          <p>Убедитесь что бэкенд запущен на порту 3000</p>
        </div>
      </Card>
    </div>
  );
};