import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BookOpen, PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SubjectType as Subject } from '../../api/subjects.api';

export const AdminSubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await subjectsApi.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Не удалось загрузить предметы');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить предмет "${name}"?`)) {
      try {
        await subjectsApi.delete(id);
        toast.success(`Предмет "${name}" удален`);
        fetchSubjects();
      } catch (error: any) {
        console.error('Error deleting subject:', error);
        toast.error(error.response?.data?.message || 'Ошибка при удалении предмета');
      }
    }
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
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            Назад в админ панель
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Управление предметами</h1>
          <p className="text-gray-600 mt-1">Создание, редактирование и удаление предметов</p>
        </div>
        <Button onClick={() => navigate('/admin/create-subject')}>
          <PlusCircle size={20} className="mr-2" />
          Создать предмет
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-500">
                    ID: {subject.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/edit-subject/${subject.id}`)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(subject.id, subject.name)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            {subject.description && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{subject.description}</p>
            )}
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Создан: {new Date(subject.createdAt).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Нет предметов</h3>
          <p className="text-gray-600 mb-4">Создайте первый предмет</p>
          <Button onClick={() => navigate('/admin/create-subject')}>
            <PlusCircle size={18} className="mr-2" />
            Создать предмет
          </Button>
        </Card>
      )}
    </div>
  );
};