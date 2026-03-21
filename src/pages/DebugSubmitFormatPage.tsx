import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';

export const DebugSubmitFormatPage: React.FC = () => {
  const [testId, setTestId] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSubmit = async () => {
    if (!testId || !questionId) {
      toast.error('Введите testId и questionId');
      return;
    }

    setLoading(true);
    try {
      // Пробуем разные форматы
      const formats = [
        {
          name: "Format 1: { testId, answers: [{ questionId, selectedOption }] }",
          data: {
            testId: testId,
            answers: [
              { questionId: questionId, selectedOption: parseInt(selectedOption) || 0 }
            ]
          }
        },
        {
          name: "Format 2: { testId, answers: [{ questionId, answer }] }",
          data: {
            testId: testId,
            answers: [
              { questionId: questionId, answer: parseInt(selectedOption) || 0 }
            ]
          }
        },
        {
          name: "Format 3: { testId, answers: { questionId: answer } }",
          data: {
            testId: testId,
            answers: { [questionId]: parseInt(selectedOption) || 0 }
          }
        },
        {
          name: "Format 4: { testId, answers: [answer1] }",
          data: {
            testId: testId,
            answers: [parseInt(selectedOption) || 0]
          }
        }
      ];

      const results: any = {};

      for (const format of formats) {
        try {
          console.log(`Trying ${format.name}:`, format.data);
          const res = await apiClient.post('/tests/submit', format.data);
          results[format.name] = {
            success: true,
            status: res.status,
            data: res.data
          };
          console.log(`✅ ${format.name} succeeded!`);
          setResponse(results);
          toast.success(`Найден правильный формат!`);
          return;
        } catch (err: any) {
          results[format.name] = {
            success: false,
            status: err.response?.status,
            error: err.response?.data
          };
        }
      }

      setResponse(results);
      toast.error('Ни один формат не сработал');
    } catch (error: any) {
      console.error('Error:', error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGetTest = async () => {
    if (!testId) return;
    
    try {
      const res = await apiClient.get(`/tests/${testId}`);
      console.log('Test data:', res.data);
      setResponse({ getTest: res.data });
      if (res.data?.data?.questions) {
        const firstQuestion = res.data.data.questions[0];
        setQuestionId(firstQuestion.id);
        toast.success(`Вопрос загружен, ID: ${firstQuestion.id}`);
      }
    } catch (error: any) {
      setResponse({ error: error.response?.data });
      toast.error('Тест не найден');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Отладка формата отправки теста</h1>
      
      <Card className="space-y-4">
        <Input
          label="ID теста"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          placeholder="Введите ID теста"
        />

        <Input
          label="ID вопроса (опционально)"
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          placeholder="Введите ID вопроса"
        />

        <Input
          label="Выбранный ответ (0-3)"
          type="number"
          min="0"
          max="3"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          placeholder="0"
        />

        <div className="flex space-x-2">
          <Button onClick={testSubmit} loading={loading}>
            Тест отправки
          </Button>
          <Button onClick={testGetTest} variant="outline">
            Получить тест (автозаполнит ID вопроса)
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
          <p className="font-semibold">Попробуйте:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Нажмите "Получить тест" для загрузки ID вопроса</li>
            <li>Выберите ответ (0-3)</li>
            <li>Нажмите "Тест отправки"</li>
            <li>Смотрите, какой формат сработает</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};