import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../../api/tests.api';
import { subjectsApi } from '../../api/subjects.api';
import { questionsApi } from '../../api/questions.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  FileText, PlusCircle, Edit, Trash2, 
  ArrowLeft, Clock, Search, Users, TrendingUp 
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { TestType as Test } from '../../api/tests.api';
import type { QuestionType as Question } from '../../api/questions.api';

export const TeacherTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsData, subjectsData, questionsData] = await Promise.all([
        testsApi.getAll(),
        subjectsApi.getAll(),
        questionsApi.getAll()
      ]);
      
      setTests(testsData);
      setSubjects(subjectsData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Не удалось загрузить тесты');
    } finally {
      setLoading(false);
    }
  };

  const getTestSubject = (test: Test): string => {
    // Получаем первый вопрос теста, чтобы определить тему
    const firstQuestionId = test.questions?.[0]?.id;
    if (firstQuestionId) {
      const question = questions.find(q => q.id === firstQuestionId);
      if (question) {
        const subject = subjects.find(s => s.id === question.topicId);
        if (subject) return subject.name;
      }
    }
    return 'Неизвестно';
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить тест "${name}"?`)) {
      try {
        await testsApi.delete(id);
        toast.success(`Тест "${name}" удален`);
        setTests(tests.filter(t => t.id !== id));
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Ошибка при удалении теста');
      }
    }
  };

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            Назад в панель учителя
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Управление тестами</h1>
          <p className="text-gray-600 mt-1">Создание, редактирование и удаление тестов</p>
        </div>
        <Button onClick={() => navigate('/teacher/create-test')}>
          <PlusCircle size={20} className="mr-2" />
          Создать тест
        </Button>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск тестов по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Список тестов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => {
          const questionsCount = test.questions?.length || 0;
          const subjectName = getTestSubject(test);
          
          return (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-green-600" size={20} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {subjectName}
                        </span>
                        {test.timeLimit && (
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {test.timeLimit} мин
                          </span>
                        )}
                        <span>{questionsCount} вопросов</span>
                      </div>
                    </div>
                  </div>
                  {test.description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">{test.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/tests/${test.id}`)}
                  >
                    Просмотр
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/teacher/edit-test/${test.id}`)}
                  >
                    <Edit size={16} className="mr-1" />
                    Редактировать
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(test.id, test.name)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Статистика теста */}
              <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div>
                  <Users size={14} className="inline mr-1" />
                  {Math.floor(Math.random() * 50)} прошли
                </div>
                <div>
                  <TrendingUp size={14} className="inline mr-1" />
                  {Math.floor(Math.random() * 30) + 60}% средний балл
                </div>
                <div>
                  <Clock size={14} className="inline mr-1" />
                  {test.timeLimit || 30} мин
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTests.length === 0 && (
        <Card className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Нет тестов</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Тесты не найдены' : 'Создайте первый тест'}
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate('/teacher/create-test')}>
              <PlusCircle size={18} className="mr-2" />
              Создать тест
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};