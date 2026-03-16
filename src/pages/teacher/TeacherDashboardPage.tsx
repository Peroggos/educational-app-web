import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Users, BookOpen, FileText, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { subjectsApi } from '../../api/subjects.api';
import { testsApi } from '../../api/tests.api';
import { useNavigate } from 'react-router-dom';

import type { Subject } from '../../types/lesson.types';
import type { Test } from '../../types/lesson.types';

export const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsData, testsData] = await Promise.all([
          subjectsApi.getAll(),
          testsApi.getAll(),
        ]);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        setTests(Array.isArray(testsData) ? testsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: Users, label: 'Учеников', value: '24', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Предметов', value: subjects.length.toString(), color: 'bg-green-500' },
    { icon: FileText, label: 'Тестов', value: tests.length.toString(), color: 'bg-purple-500' },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Панель учителя</h1>
        <Button onClick={() => navigate('/teacher/create-test')}>
          <PlusCircle size={20} className="mr-2" />
          Создать тест
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center space-x-4">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Мои тесты */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Мои тесты</h2>
        <div className="space-y-3">
          {tests.map((test) => {
            // Временное решение, так как в тестах нет subjectId
            return (
              <Card key={test.id} className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-gray-600">
                    {test.questions?.length || 0} вопросов
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/teacher/edit-test/${test.id}`)}
                  >
                    <Edit size={16} className="mr-1" />
                    Редактировать
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
                        console.log('Delete test:', test.id);
                      }
                    }}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Удалить
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => navigate('/teacher/create-lesson')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="text-primary-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Создать урок</h3>
              <p className="text-sm text-gray-600">Добавьте новый учебный материал</p>
            </div>
          </div>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => navigate('/teacher/students')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Управление учениками</h3>
              <p className="text-sm text-gray-600">Просмотр прогресса и статистики</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};