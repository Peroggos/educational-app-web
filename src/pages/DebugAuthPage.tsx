import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const DebugAuthPage: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');

  const testHealth = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/health');
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data
      });
    } catch (error: any) {
      setResponse({
        error: true,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data
      });
      
      // Если успешно, показываем токен
      if (res.data?.data?.access_token) {
        console.log('Token:', res.data.data.access_token);
      }
    } catch (error: any) {
      setResponse({
        error: true,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const testProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/users/profile');
      setResponse({
        status: res.status,
        data: res.data
      });
    } catch (error: any) {
      setResponse({
        error: true,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Отладка API</h1>
        
        <div className="space-y-6">
          {/* Тестовые данные */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Кнопки тестов */}
          <div className="flex space-x-4">
            <Button onClick={testHealth} loading={loading}>
              Проверить Health
            </Button>
            
            <Button onClick={testLogin} loading={loading} variant="primary">
              Тестовый вход
            </Button>

            <Button onClick={testProfile} loading={loading} variant="outline">
              Профиль
            </Button>
          </div>

          {/* Ответ */}
          {response && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Ответ сервера:</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {/* Информация */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Информация</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• API URL: http://localhost:3000/api</li>
              <li>• Токен сохраняется в localStorage под ключом 'token'</li>
              <li>• Формат ответа сервера: {"{ data: ..., timestamp: ..., path: ... }"}</li>
              <li>• Для авторизации используйте: Bearer токен</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};