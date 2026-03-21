import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { testsApi } from '../../api/tests.api';
import { lessonsApi } from '../../api/lessons.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FileText, Video, ArrowLeft, ChevronRight } from 'lucide-react';
import type { SubjectType as Subject } from '../../api/subjects.api';
import type { TopicType as Topic } from '../../api/subjects.api';
import type { TestType as Test } from '../../api/tests.api';
import type { LessonType as Lesson } from '../../api/lessons.api';

export const StudentSubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [testsByTopic, setTestsByTopic] = useState<Record<string, Test[]>>({});
  const [lessonsByTopic, setLessonsByTopic] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем информацию о предмете
        const subjectData = await subjectsApi.getById(id!);
        setSubject(subjectData);

        // Получаем темы предмета
        const topicsData = await subjectsApi.getTopics(id!);
        setTopics(topicsData);

        // Для каждой темы получаем тесты и уроки
        const testsMap: Record<string, Test[]> = {};
        const lessonsMap: Record<string, Lesson[]> = {};

        await Promise.all(
          topicsData.map(async (topic) => {
            const [tests, lessons] = await Promise.all([
              testsApi.getByTopic(topic.id), // Изменено с getTestsByTopic на getByTopic
              lessonsApi.getByTopic(topic.id)
            ]);
            testsMap[topic.id] = tests;
            lessonsMap[topic.id] = lessons;
          })
        );

        setTestsByTopic(testsMap);
        setLessonsByTopic(lessonsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Предмет не найден</p>
        <Button onClick={() => navigate('/student/subjects')} className="mt-4">
          К предметам
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Навигация */}
      <button
        onClick={() => navigate('/student/subjects')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад к предметам
      </button>

      {/* Информация о предмете */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
        {subject.description && (
          <p className="text-gray-600 mt-2">{subject.description}</p>
        )}
      </div>

      {/* Темы */}
      <div className="space-y-6">
        {topics.map((topic) => (
          <Card key={topic.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{topic.name}</h2>
                {topic.description && (
                  <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                )}
              </div>
            </div>

            {/* Уроки */}
            {lessonsByTopic[topic.id]?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Уроки</h3>
                <div className="space-y-2">
                  {lessonsByTopic[topic.id].map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => navigate(`/student/lesson/${lesson.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <Video className="text-primary-600" size={18} />
                        <span className="text-gray-900">{lesson.title}</span>
                      </div>
                      <ChevronRight className="text-gray-400" size={18} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Тесты */}
            {testsByTopic[topic.id]?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Тесты</h3>
                <div className="space-y-2">
                  {testsByTopic[topic.id].map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => navigate(`/student/test/${test.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="text-green-600" size={18} />
                        <div>
                          <span className="text-gray-900">{test.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {test.questions?.length || 0} вопросов • {test.timeLimit || 30} мин
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Начать</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!lessonsByTopic[topic.id]?.length && !testsByTopic[topic.id]?.length) && (
              <p className="text-sm text-gray-500">Нет доступных материалов</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};