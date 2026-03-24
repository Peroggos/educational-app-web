import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectsApi } from '../api/subjects.api';
import { testsApi } from '../api/tests.api';
import { lessonsApi } from '../api/lessons.api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { BookOpen, FileText, Video, ArrowLeft, ChevronRight, Clock, PlusCircle, AlertCircle } from 'lucide-react';
import type { SubjectType as Subject } from '../api/subjects.api';
import type { TopicType as Topic } from '../api/subjects.api';
import type { Test as Test } from '../api/tests.api';
import type { LessonType as Lesson } from '../api/lessons.api';

export const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [testsByTopic, setTestsByTopic] = useState<Record<string, Test[]>>({});
  const [lessonsByTopic, setLessonsByTopic] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const subjectData = await subjectsApi.getById(id!);
        setSubject(subjectData);

        const topicsData = await subjectsApi.getTopics(id!);
        setTopics(topicsData);

        const testsMap: Record<string, Test[]> = {};
        const lessonsMap: Record<string, Lesson[]> = {};

        await Promise.all(
          topicsData.map(async (topic) => {
            const [tests, lessons] = await Promise.all([
              testsApi.getByTopic(topic.id),
              lessonsApi.getByTopic(topic.id)
            ]);
            testsMap[topic.id] = tests;
            lessonsMap[topic.id] = lessons;
          })
        );

        setTestsByTopic(testsMap);
        setLessonsByTopic(lessonsMap);
        
        if (topicsData.length > 0) {
          setExpandedTopic(topicsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Повторить</Button>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Предмет не найден</p>
        <Button onClick={() => navigate('/subjects')} className="mt-4">
          К предметам
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/subjects')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад к предметам
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
          {subject.description && (
            <p className="text-gray-600 mt-2">{subject.description}</p>
          )}
        </div>
        {isTeacher && (
          <Button 
            onClick={() => navigate(`/teacher/create-topic?subjectId=${subject.id}`)}
            variant="outline"
          >
            <PlusCircle size={18} className="mr-2" />
            Добавить тему
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {topics.map((topic) => {
          const lessons = lessonsByTopic[topic.id] || [];
          const tests = testsByTopic[topic.id] || [];
          const isExpanded = expandedTopic === topic.id;
          
          return (
            <Card key={topic.id} className="overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleTopic(topic.id)}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{topic.name}</h2>
                  {topic.description && (
                    <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                  )}
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                    <span>{lessons.length} уроков</span>
                    <span>{tests.length} тестов</span>
                  </div>
                </div>
                <ChevronRight 
                  size={20} 
                  className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </div>

              {isExpanded && (
                <div className="border-t p-4 space-y-4">
                  {lessons.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-medium text-gray-700 flex items-center">
                          <Video size={18} className="mr-2 text-primary-600" />
                          Уроки
                        </h3>
                        {isTeacher && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/teacher/create-lesson/${topic.id}`);
                            }}
                          >
                            <PlusCircle size={14} className="mr-1" />
                            Добавить урок
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => navigate(`/student/lesson/${lesson.id}`)}
                          >
                            <div className="flex items-center space-x-3">
                              <Video className="text-primary-600" size={18} />
                              <div>
                                <span className="text-gray-900 font-medium">{lesson.title}</span>
                                {lesson.duration && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    <Clock size={12} className="inline mr-1" />
                                    {lesson.duration} мин
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="text-gray-400" size={18} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tests.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-medium text-gray-700 flex items-center">
                          <FileText size={18} className="mr-2 text-green-600" />
                          Тесты
                        </h3>
                        {isTeacher && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/teacher/create-test?topicId=${topic.id}`)}
                          >
                            <PlusCircle size={14} className="mr-1" />
                            Добавить тест
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {tests.map((test) => (
                          <div
                            key={test.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => navigate(`/tests/${test.id}`)}
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="text-green-600" size={18} />
                              <div>
                                <span className="text-gray-900 font-medium">{test.name}</span>
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

                  {lessons.length === 0 && tests.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-3">В этой теме пока нет материалов</p>
                      {isTeacher && (
                        <div className="flex justify-center space-x-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/teacher/create-lesson/${topic.id}`)}
                          >
                            <PlusCircle size={14} className="mr-1" />
                            Создать урок
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/teacher/create-test?topicId=${topic.id}`)}
                          >
                            <PlusCircle size={14} className="mr-1" />
                            Создать тест
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}

        {topics.length === 0 && (
          <Card className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Нет тем</h3>
            <p className="text-gray-600 mb-4">В этом предмете пока нет тем</p>
            {isTeacher && (
              <Button onClick={() => navigate(`/teacher/create-topic?subjectId=${subject.id}`)}>
                <PlusCircle size={18} className="mr-2" />
                Добавить тему
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};