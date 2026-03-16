import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../../api/tests.api';
import { CreateTestData } from '../../types/lesson.types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { PlusCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuestionForm {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const CreateTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timeLimit: 30,
  });

  const addQuestion = () => {
    const newQuestion: QuestionForm = {
      text: '',
      options: ['', '', '', ''],
      correctOption: 0,
      difficulty: 'MEDIUM',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      toast.error('Добавьте хотя бы один вопрос');
      return;
    }

    setLoading(true);

    try {
      // В реальном приложении здесь был бы запрос к API
      // Пока просто показываем успех
      console.log('Test data:', { ...formData, questions });
      
      toast.success('Тест успешно создан!');
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error('Ошибка при создании теста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Создание нового теста</h1>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-4 mb-6">
          <Input
            label="Название теста"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <Input
            label="Время (минуты)"
            type="number"
            value={formData.timeLimit.toString()}
            onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
            required
          />
        </Card>

        {/* Вопросы */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Вопросы</h2>
            <Button type="button" onClick={addQuestion} size="sm">
              <PlusCircle size={16} className="mr-1" />
              Добавить вопрос
            </Button>
          </div>

          {questions.map((question, index) => (
            <Card key={index} className="relative">
              <div className="absolute right-2 top-2">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="space-y-4 pr-12">
                <Input
                  label={`Вопрос ${index + 1}`}
                  value={question.text}
                  onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Варианты ответов
                  </label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={question.correctOption === optIndex}
                        onChange={() => updateQuestion(index, 'correctOption', optIndex)}
                        className="h-4 w-4 text-primary-600"
                      />
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, optIndex, e.target.value)}
                        placeholder={`Вариант ${optIndex + 1}`}
                        className="flex-1"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сложность
                  </label>
                  <select
                    value={question.difficulty}
                    onChange={(e) => updateQuestion(index, 'difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="EASY">Легкий</option>
                    <option value="MEDIUM">Средний</option>
                    <option value="HARD">Сложный</option>
                  </select>
                </div>

                <Input
                  label="Пояснение (необязательно)"
                  value={question.explanation || ''}
                  onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                />
              </div>
            </Card>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Добавьте вопросы к тесту</p>
              <Button type="button" onClick={addQuestion} className="mt-4">
                Добавить первый вопрос
              </Button>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Создать тест
          </Button>
        </div>
      </form>
    </div>
  );
};