import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonsApi } from '../api/lessons.api';
import { testsApi } from '../api/tests.api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Clock, ArrowLeft, Video, FileText, Link as LinkIcon, Image, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string;
  order: number;
  topicId: string;
  videoUrl?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

interface Test {
  id: string;
  name: string;
  description?: string;
  timeLimit?: number;
  questions?: any[];
}

export const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [topicTests, setTopicTests] = useState<Test[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching lesson with ID:', id);
      
      // Проверка на невалидный ID
      if (!id || id === 'adasd' || id === 'qwe' || id.length < 10) {
        console.error('Invalid lesson ID:', id);
        toast.error('Неверный ID урока');
        // Перенаправляем на страницу предметов
        navigate('/subjects');
        return;
      }
      
      const lessonData = await lessonsApi.getById(id!);
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
        navigate('/subjects');
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

  const goToPreviousLesson = () => {
    if (allLessons.length === 0) {
      toast.success('Нет доступных уроков');
      return;
    }
    
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      navigate(`/student/lesson/${prevLesson.id}`);
    } else {
      toast.success('Это первый урок в теме');
    }
  };

  const goToNextLesson = () => {
    if (allLessons.length === 0) {
      toast.success('Нет доступных уроков');
      return;
    }
    
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      navigate(`/student/lesson/${nextLesson.id}`);
    } else {
      toast.success('Это последний урок в теме');
    }
  };

  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'VIDEO': return <Video className="text-blue-500" size={20} />;
      case 'PDF': return <FileText className="text-red-500" size={20} />;
      case 'LINK': return <LinkIcon className="text-green-500" size={20} />;
      case 'IMAGE': return <Image className="text-purple-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
  };

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
        <Button 
          variant="outline" 
          onClick={goToPreviousLesson}
          disabled={currentIndex <= 0 || allLessons.length <= 1}
        >
          ← Предыдущий урок
        </Button>
        <Button onClick={() => navigate('/subjects')}>
          К списку предметов
        </Button>
        <Button 
          variant="outline" 
          onClick={goToNextLesson}
          disabled={currentIndex >= allLessons.length - 1 || allLessons.length <= 1}
        >
          Следующий урок →
        </Button>
      </div>
    </div>
  );
};