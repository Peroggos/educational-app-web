import React, { useEffect, useState } from 'react';
import { subjectsApi } from '../api/subjects.api';
import type { SubjectType as Subject } from '../api/subjects.api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsApi.getAll();
        console.log('Subjects page data:', data);
        setSubjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Нет доступных предметов</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Предметы</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-primary-600" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{subject.name}</h2>
            </div>
            
            <p className="text-gray-600 mb-4">{subject.description}</p>
            
            <Button
              onClick={() => navigate(`/subjects/${subject.id}`)}
              fullWidth
            >
              Перейти к темам
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};