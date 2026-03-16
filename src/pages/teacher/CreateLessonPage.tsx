import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessonsApi } from '../../api/lessons.api';
import { subjectsApi } from '../../api/subjects.api';
import { CreateLessonData } from '../../types/lesson.types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';

interface Topic {
  id: string;
  name: string;
  subjectId: string;
  description?: string;
}

export const CreateLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    duration: 30,
    topicId: '',
    order: 1,
  });

  // Загружаем предметы
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsApi.getAll();
        setSubjects(data.map(s => ({ id: s.id, name: s.name })));
        if (data.length > 0) {
          setSelectedSubject(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Не удалось загрузить список предметов');
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  // Загружаем темы при выборе предмета
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedSubject) {
        setTopics([]);
        return;
      }

      setLoadingTopics(true);
      try {
        console.log('Fetching topics for subject:', selectedSubject);
        const data = await subjectsApi.getTopics(selectedSubject);
        console.log('Topics loaded:', data);
        setTopics(data);
        
        // Если есть темы и текущая выбранная тема не принадлежит этому предмету, сбрасываем выбор
        if (formData.topicId) {
          const selectedTopic = data.find(t => t.id === formData.topicId);
          if (!selectedTopic) {
            setFormData(prev => ({ ...prev, topicId: '' }));
          }
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast.error('Не удалось загрузить список тем');
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [selectedSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Проверяем обязательные поля
      if (!formData.title.trim()) {
        toast.error('Введите название урока');
        setLoading(false);
        return;
      }
      if (!formData.content.trim()) {
        toast.error('Введите содержание урока');
        setLoading(false);
        return;
      }
      if (!formData.topicId) {
        toast.error('Выберите тему');
        setLoading(false);
        return;
      }
      if (!formData.order || formData.order < 1) {
        toast.error('Введите корректный порядок урока');
        setLoading(false);
        return;
      }

      const lessonData: CreateLessonData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        content: formData.content,
        order: formData.order,
        topicId: formData.topicId,
        videoUrl: formData.videoUrl.trim() || undefined,
        duration: formData.duration,
      };

      console.log('Sending lesson data:', lessonData);
      
      const result = await lessonsApi.create(lessonData);
      console.log('Lesson created:', result);
      
      toast.success('Урок успешно создан!');
      navigate('/teacher/dashboard');
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      
      if (error.response?.status === 400) {
        toast.error('Проверьте правильность заполнения полей');
      } else if (error.response?.status === 401) {
        toast.error('Необходима авторизация');
      } else if (error.response?.status === 403) {
        toast.error('У вас нет прав для создания урока');
      } else if (error.response?.status === 404) {
        toast.error('Указанная тема не найдена');
      } else {
        toast.error(error.response?.data?.message || 'Ошибка при создании урока');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingSubjects) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Создание нового урока</h1>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-4">
          {/* Название урока */}
          <Input
            label="Название урока *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Введите название урока"
            required
          />

          {/* Описание */}
          <Input
            label="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Краткое описание урока"
          />

          {/* Выбор предмета */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Предмет *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Выберите предмет</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Выбор темы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тема *
            </label>
            <select
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!selectedSubject || loadingTopics}
              required
            >
              <option value="">
                {loadingTopics ? 'Загрузка...' : 'Выберите тему'}
              </option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Порядок и длительность */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Порядок в теме *"
              type="number"
              min="1"
              value={formData.order.toString()}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              required
            />
            
            <Input
              label="Длительность (минуты)"
              type="number"
              min="1"
              value={formData.duration.toString()}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
            />
          </div>

          {/* Видео URL */}
          <Input
            label="Ссылка на видео"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=... или https://vimeo.com/..."
          />

          {/* Контент урока */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Содержание урока *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
              placeholder="Введите HTML-содержание урока..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Можно использовать HTML теги: &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, и т.д.
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              Создать урок
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};