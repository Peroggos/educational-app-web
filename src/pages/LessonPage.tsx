import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonsApi } from '../api/lessons.api';
import { testsApi } from '../api/tests.api';
import { Lesson, Test } from '../types/lesson.types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Video, FileText, Link as LinkIcon, Image, Clock, ArrowLeft } from 'lucide-react';

// Временный интерфейс для ресурсов, так как их нет в схеме Prisma
interface Resource {
  id: string;
  type: 'VIDEO' | 'PDF' | 'LINK' | 'IMAGE';
  title: string;
  url: string;
}

export const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [topicTests, setTopicTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  // Временные мок-данные для ресурсов
  const mockResources: Resource[] = [
    {
      id: '1',
      type: 'PDF',
      title: 'Презентация к уроку',
      url: '/files/presentation.pdf'
    },
    {
      id: '2',
      type: 'VIDEO',
      title: 'Дополнительное видео',
      url: 'https://youtube.com/watch?v=123'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Используем правильное название метода - getById вместо getLesson
        const lessonData = await lessonsApi.getById(id!);
        setLesson(lessonData);

        // Загружаем тесты по теме урока
        if (lessonData.topicId) {
          const tests = await testsApi.getTestsByTopic(lessonData.topicId);
          setTopicTests(tests);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Урок не найден</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад
      </button>

      {/* Заголовок урока */}
      <div className="flex justify-between items-start">
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
      </div>

      {/* Контент урока */}
      <Card>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </Card>

      {/* Видео, если есть */}
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

      {/* Временные ресурсы (пока нет в БД) */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Дополнительные материалы</h2>
        <div className="space-y-2">
          {mockResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {getResourceIcon(resource.type)}
              <span className="ml-3 text-gray-700">{resource.title}</span>
            </a>
          ))}
        </div>
      </Card>

      {/* Тесты по теме */}
      {topicTests.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Тесты по теме</h2>
          <div className="space-y-3">
            {topicTests.map((test) => {
              // Временные данные, так как в схеме Prisma нет passingScore
              return (
                <div
                  key={test.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-600">
                      {test.questions?.length || 0} вопросов
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/tests/${test.id}`)}
                    size="sm"
                  >
                    Начать тест
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Навигация */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Предыдущий урок
        </Button>
        <Button onClick={() => navigate('/subjects')}>
          К списку предметов
        </Button>
        <Button variant="outline" onClick={() => navigate('/subjects')}>
          Следующий урок
        </Button>
      </div>
    </div>
  );
};