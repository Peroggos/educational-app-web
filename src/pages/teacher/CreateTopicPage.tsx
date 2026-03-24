import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ArrowLeft, BookOpen, PlusCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateTopicPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId || '');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  // Получаем query параметр subjectId если есть
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const querySubjectId = queryParams.get('subjectId');
    if (querySubjectId && !subjectId) {
      setSelectedSubjectId(querySubjectId);
    }
  }, [location, subjectId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsApi.getAll();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Не удалось загрузить предметы');
      }
    };
    fetchSubjects();
  }, []);

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название темы обязательно';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Название должно содержать минимум 2 символа';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Название не должно превышать 100 символов';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedSubjectId) {
    toast.error('Выберите предмет');
    return;
  }
  
  if (!validateForm()) {
    return;
  }
  
  setLoading(true);
  
  try {
    const topicData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      subjectId: selectedSubjectId,
    };
    
    console.log('Creating topic with data:', JSON.stringify(topicData, null, 2));
    
    const result = await subjectsApi.createTopic(topicData);
    console.log('Topic created:', result);
    
    toast.success(`Тема "${result.name}" успешно создана!`);
    
    // Перенаправление на страницу предмета
    setTimeout(() => {
      navigate(`/subjects/${selectedSubjectId}`);
    }, 1500);
    
  } catch (error: any) {
    console.error('Error creating topic:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg: string) => {
          console.error('Validation error:', msg);
          toast.error(msg);
        });
      } else if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      } else {
        toast.error('Проверьте правильность заполнения полей');
      }
    } else if (error.response?.status === 409) {
      toast.error('Тема с таким названием уже существует в этом предмете');
      setErrors({ ...errors, name: 'Тема с таким названием уже существует' });
    } else if (error.response?.status === 403) {
      toast.error('У вас нет прав для создания темы');
    } else {
      toast.error(error.response?.data?.message || 'Ошибка при создании темы');
    }
  } finally {
    setLoading(false);
  }
};

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject?.name || 'Выберите предмет';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Навигация */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад
      </button>

      <h1 className="text-3xl font-bold text-gray-900">Создание новой темы</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="space-y-6">
          {/* Иконка темы */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="text-primary-600" size={40} />
            </div>
          </div>
          
          {/* Выбор предмета */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Предмет *
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
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
            {selectedSubjectId && (
              <p className="text-xs text-gray-500 mt-1">
                Тема будет добавлена в предмет "{getSubjectName(selectedSubjectId)}"
              </p>
            )}
          </div>
          
          {/* Название темы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название темы *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Например: Алгебра, Геометрия, Программирование"
              error={errors.name}
              className="text-lg"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Название должно быть уникальным в пределах предмета
            </p>
          </div>
          
          {/* Описание темы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Краткое описание темы (необязательно)"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Максимум 500 символов
            </p>
          </div>
          
          {/* Предпросмотр */}
          {formData.name && selectedSubjectId && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{formData.name}</p>
                  <p className="text-xs text-gray-500">{getSubjectName(selectedSubjectId)}</p>
                  {formData.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">{formData.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.name.trim() || !selectedSubjectId}
            >
              <CheckCircle size={18} className="mr-2" />
              Создать тему
            </Button>
          </div>
        </Card>
      </form>
      
      {/* Информация о темах */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-2">О темах</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Темы помогают структурировать учебный материал внутри предмета</li>
          <li>Каждая тема может содержать несколько уроков и тестов</li>
          <li>Учителя могут создавать и редактировать темы</li>
          <li>Студенты видят темы и изучают материалы по порядку</li>
        </ul>
      </Card>
    </div>
  );
};