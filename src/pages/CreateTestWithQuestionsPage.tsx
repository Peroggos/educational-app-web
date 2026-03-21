import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  text: string;
  options: string[];
  difficulty: string;
}

export const CreateTestWithQuestionsPage: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await apiClient.get('/questions');
      console.log('Questions loaded:', res.data);
      setAllQuestions(res.data?.data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Не удалось загрузить вопросы');
    }
  };

  const createTest = async () => {
    if (!testName) {
      toast.error('Введите название теста');
      return;
    }
    if (selectedQuestionIds.length === 0) {
      toast.error('Выберите хотя бы один вопрос');
      return;
    }

    setLoading(true);
    try {
      const testData = {
        name: testName,
        description: testDescription,
        timeLimit: timeLimit,
        questionIds: selectedQuestionIds
      };

      console.log('Creating test with data:', JSON.stringify(testData, null, 2));
      
      const res = await apiClient.post('/tests', testData);
      console.log('Test created successfully:', res.data);
      
      toast.success('Тест успешно создан!');
      
      const testId = res.data?.data?.id;
      if (testId) {
        setTimeout(() => {
          window.location.href = `/tests/${testId}`;
        }, 1500);
      } else {
        setTimeout(() => {
          window.location.href = '/teacher/dashboard';
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error creating test:', error);
      console.error('Error response FULL:', error.response);
      console.error('Error response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        if (Array.isArray(errorMessage)) {
          toast.error(errorMessage.join(', '));
          errorMessage.forEach((msg, i) => console.log(`Error ${i}:`, msg));
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Ошибка при создании теста');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Создание теста с вопросами</h1>
      
      <Card className="space-y-4">
        <Input
          label="Название теста *"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Введите название теста"
          required
        />

        <Input
          label="Описание"
          value={testDescription}
          onChange={(e) => setTestDescription(e.target.value)}
          placeholder="Описание теста (необязательно)"
        />

        <Input
          label="Время (минуты)"
          type="number"
          value={timeLimit.toString()}
          onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
        />

        <div className="space-y-2">
          <h3 className="font-semibold">
            Выберите вопросы для теста ({selectedQuestionIds.length} выбрано):
          </h3>
          <div className="max-h-96 overflow-y-auto space-y-2 border rounded p-2">
            {allQuestions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Нет доступных вопросов</p>
            ) : (
              allQuestions.map((q) => (
                <label key={q.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedQuestionIds.includes(q.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuestionIds([...selectedQuestionIds, q.id]);
                      } else {
                        setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== q.id));
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{q.text}</div>
                    <div className="text-sm text-gray-500">
                      Варианты: {q.options?.join(', ')} • Сложность: {q.difficulty}
                    </div>
                    <div className="text-xs text-gray-400">ID: {q.id}</div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <Button 
          onClick={createTest} 
          loading={loading} 
          disabled={allQuestions.length === 0}
        >
          Создать тест ({selectedQuestionIds.length} вопросов)
        </Button>
      </Card>
    </div>
  );
};