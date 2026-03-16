import React, { useEffect, useState } from 'react';
import { subjectsApi } from '../../api/subjects.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { Copy, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Topic {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  subjectName?: string;
}

export const TopicsListPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const subjects = await subjectsApi.getAll();
        const allTopics: Topic[] = [];
        
        for (const subject of subjects) {
          const subjectTopics = await subjectsApi.getTopics(subject.id);
          const topicsWithSubject = subjectTopics.map(topic => ({
            ...topic,
            subjectName: subject.name
          }));
          allTopics.push(...topicsWithSubject);
        }
        
        setTopics(allTopics);
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast.error('Не удалось загрузить список тем');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`ID темы "${name}" скопирован`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Назад
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Доступные темы</h1>
        <div className="w-20"></div>
      </div>
      
      <div className="grid gap-4">
        {topics.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">
              Нет доступных тем. Сначала создайте предмет и тему.
            </p>
          </Card>
        ) : (
          topics.map((topic) => (
            <Card key={topic.id} className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                <p className="text-sm text-gray-600">
                  Предмет: {topic.subjectName || 'Неизвестно'}
                </p>
                {topic.description && (
                  <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2 font-mono">ID: {topic.id}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(topic.id, topic.name)}
                className="ml-4"
              >
                <Copy size={16} className="mr-2" />
                Копировать ID
              </Button>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button onClick={() => navigate('/teacher/create-lesson')}>
          Создать урок
        </Button>
      </div>
    </div>
  );
};