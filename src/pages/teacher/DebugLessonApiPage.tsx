import React, { useState } from 'react';
import { apiClient } from '../../api/client';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';

export const DebugLessonApiPage: React.FC = () => {
  const [testData, setTestData] = useState({
    title: 'Тестовый урок',
    description: 'Описание тестового урока',
    content: '<h1>Содержание урока</h1><p>Тестовый контент</p>',
    order: 1,
    topicId: '',
    videoUrl: '',
    duration: 30,
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCreateLesson = async () => {
    if (!testData.topicId) {
      toast.error('Введите ID темы');
      return;
    }

    setLoading(true);
    try {
      console.log('Testing lesson creation with data:', testData);
      
      const response = await apiClient.post('/lessons', testData);
      console.log('Success:', response.data);
      setResponse({ success: true, data: response.data });
      toast.success('Урок успешно создан!');
    } catch (error: any) {
      console.error('Error:', error);
      setResponse({ 
        success: false, 
        error: error.message,
        responseData: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const testGetTopics = async () => {
    try {
      const response = await apiClient.get('/topics');
      console.log('Topics:', response.data);
      setResponse({ topics: response.data });
      toast.success('Темы загружены, проверьте консоль');
    } catch (error: any) {
      console.error('Error:', error);
      setResponse({ error: error.response?.data });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Отладка API уроков</h1>
      
      <Card className="space-y-4">
        <Input
          label="ID темы (обязательно)"
          value={testData.topicId}
          onChange={(e) => setTestData({ ...testData, topicId: e.target.value })}
          placeholder="Введите ID темы"
        />

        <Input
          label="Название урока"
          value={testData.title}
          onChange={(e) => setTestData({ ...testData, title: e.target.value })}
        />

        <Input
          label="Описание"
          value={testData.description}
          onChange={(e) => setTestData({ ...testData, description: e.target.value })}
        />

        <Input
          label="Порядок"
          type="number"
          value={testData.order.toString()}
          onChange={(e) => setTestData({ ...testData, order: parseInt(e.target.value) })}
        />

        <Input
          label="Длительность (мин)"
          type="number"
          value={testData.duration.toString()}
          onChange={(e) => setTestData({ ...testData, duration: parseInt(e.target.value) })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Содержание урока
          </label>
          <textarea
            value={testData.content}
            onChange={(e) => setTestData({ ...testData, content: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={testCreateLesson} loading={loading}>
            Тестовое создание
          </Button>
          <Button onClick={testGetTopics} variant="outline">
            Получить темы
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
          <p className="font-semibold">Проверьте существующие темы:</p>
          <p>Выполните GET /api/topics чтобы увидеть доступные темы</p>
        </div>
      </Card>
    </div>
  );
};