import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessonsApi } from '../../api/lessons.api';
import { subjectsApi } from '../../api/subjects.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Video, PlusCircle, Edit, Trash2, 
  ArrowLeft, Clock, Search 
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { LessonType as Lesson } from '../../api/lessons.api';
import type { TopicType as Topic } from '../../api/subjects.api';

export const TeacherLessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<Record<string, Topic>>({});
  const [subjects, setSubjects] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsData, subjectsData] = await Promise.all([
        lessonsApi.getAll(),
        subjectsApi.getAll()
      ]);
      
      setLessons(lessonsData);
      
      // Загружаем темы для каждого урока
      const topicsMap: Record<string, Topic> = {};
      const subjectsMap: Record<string, any> = {};
      
      for (const subject of subjectsData) {
        subjectsMap[subject.id] = subject;
        const topicsData = await subjectsApi.getTopics(subject.id);
        topicsData.forEach(topic => {
          topicsMap[topic.id] = topic;
        });
      }
      
      setTopics(topicsMap);
      setSubjects(subjectsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Не удалось загрузить уроки');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить урок "${title}"?`)) {
      try {
        await lessonsApi.delete(id);
        toast.success(`Урок "${title}" удален`);
        setLessons(lessons.filter(l => l.id !== id));
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Ошибка при удалении урока');
      }
    }
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topics[lesson.topicId]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Управление уроками</h1>
          <p className="text-gray-600 mt-1">Создание, редактирование и удаление уроков</p>
        </div>
        <Button onClick={() => navigate('/teacher/create-lesson')}>
          <PlusCircle size={20} className="mr-2" />
          Создать урок
        </Button>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск уроков по названию или теме..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Список уроков */}
      <div className="space-y-3">
        {filteredLessons.map((lesson) => {
          const topic = topics[lesson.topicId];
          const subject = topic ? subjects[topic.subjectId] : null;
          
          return (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Video className="text-primary-600" size={20} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {subject?.name || 'Без предмета'} / {topic?.name || 'Без темы'}
                        </span>
                        {lesson.duration && (
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {lesson.duration} мин
                          </span>
                        )}
                        <span>Порядок: {lesson.order}</span>
                      </div>
                    </div>
                  </div>
                  {lesson.description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">{lesson.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/teacher/lessons/${lesson.id}`)}
                  >
                    Просмотр
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/teacher/edit-lesson/${lesson.id}`)}
                  >
                    <Edit size={16} className="mr-1" />
                    Редактировать
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(lesson.id, lesson.title)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <Card className="text-center py-12">
          <Video className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Нет уроков</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Уроки не найдены' : 'Создайте первый урок'}
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate('/teacher/create-lesson')}>
              <PlusCircle size={18} className="mr-2" />
              Создать урок
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};