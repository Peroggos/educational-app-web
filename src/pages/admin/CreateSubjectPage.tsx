import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateSubjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название предмета обязательно';
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
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const subjectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };
      
      console.log('Creating subject:', subjectData);
      
      const result = await subjectsApi.create(subjectData);
      console.log('Subject created:', result);
      
      toast.success(`Предмет "${result.name}" успешно создан!`);
      
      // Перенаправление на страницу предмета или список предметов
      setTimeout(() => {
        navigate(`/admin/subjects`);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating subject:', error);
      
      if (error.response?.status === 409) {
        toast.error('Предмет с таким названием уже существует');
        setErrors({ ...errors, name: 'Предмет с таким названием уже существует' });
      } else if (error.response?.status === 403) {
        toast.error('У вас нет прав для создания предмета');
      } else {
        toast.error(error.response?.data?.message || 'Ошибка при создании предмета');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Навигация */}
      <button
        onClick={() => navigate('/admin/subjects')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад к предметам
      </button>

      <h1 className="text-3xl font-bold text-gray-900">Создание нового предмета</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="space-y-6">
          {/* Иконка предмета */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="text-primary-600" size={40} />
            </div>
          </div>
          
          {/* Название предмета */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название предмета *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Например: Математика, Физика, История"
              error={errors.name}
              className="text-lg"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Название должно быть уникальным и не превышать 100 символов
            </p>
          </div>
          
          {/* Описание предмета */}
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
              placeholder="Краткое описание предмета (необязательно)"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Максимум 500 символов
            </p>
          </div>
          
          {/* Предпросмотр */}
          {formData.name && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{formData.name}</p>
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
              onClick={() => navigate('/admin/subjects')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.name.trim()}
            >
              <CheckCircle size={18} className="mr-2" />
              Создать предмет
            </Button>
          </div>
        </Card>
      </form>
      
      {/* Информация о предметах */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-2">О предметах</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Предметы помогают организовать учебные материалы по категориям</li>
          <li>Каждый предмет может содержать несколько тем</li>
          <li>Учителя могут создавать уроки и тесты внутри предметов</li>
          <li>Студенты видят все доступные предметы и могут изучать их</li>
        </ul>
      </Card>
    </div>
  );
};