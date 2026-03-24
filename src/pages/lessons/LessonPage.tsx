import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonsApi } from '../../api/lessons.api';
import { testsApi } from '../../api/tests.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [topicTests, setTopicTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching lesson with ID:', id);
      
      // Проверка на валидный ID (должен быть в формате cuid - 25 символов)
      const isValidId = id && /^[a-z0-9]{25}$/.test(id);
      
      if (!isValidId) {
        console.error('Invalid lesson ID format:', id);
        toast.error('Неверный ID урока');
        navigate('/subjects', { replace: true });
        return;
      }
      
      const lessonData = await lessonsApi.getById(id);
      console.log('Lesson data:', lessonData);
      setLesson(lessonData);

      if (lessonData.topicId) {
        const tests = await testsApi.getByTopic(lessonData.topicId);
        setTopicTests(tests);
      }
    } catch (error: any) {
      console.error('Error fetching lesson:', error);
      if (error.response?.status === 404) {
        toast.error('Урок не найден');
        navigate('/subjects', { replace: true });
      } else {
        setError(error.response?.data?.message || 'Не удалось загрузить урок');
      }
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchData();
  }
}, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error || 'Урок не найден'}</p>
        <Button onClick={() => navigate('/subjects')}>Вернуться к предметам</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-gray-600 mt-2">{lesson.description}</p>
        )}
        {lesson.duration && (
          <div className="flex items-center text-gray-600 mt-2">
            <Clock size={16} className="mr-1" />
            <span>{lesson.duration} минут</span>
          </div>
        )}
      </div>

      <Card>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </Card>

      {lesson.videoUrl && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Видеоурок</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-96 rounded-lg"
              allowFullScreen
            />
          </div>
        </Card>
      )}

      {topicTests.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Тесты по теме</h2>
          <div className="space-y-3">
            {topicTests.map((test) => (
              <div
                key={test.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600">
                    {test.questions?.length || 0} вопросов • {test.timeLimit || 30} минут
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/tests/${test.id}`)}
                  size="sm"
                >
                  Начать тест
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Предыдущий урок
        </Button>
        <Button onClick={() => navigate('/subjects')}>
          К списку предметов
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Следующий урок
        </Button>
      </div>
    </div>
  );
};