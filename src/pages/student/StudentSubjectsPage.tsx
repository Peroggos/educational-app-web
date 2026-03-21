import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsApi } from '../../api/subjects.api';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import type { SubjectType as Subject } from '../../api/subjects.api';

export const StudentSubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsApi.getAll();
        setSubjects(data);
        setFilteredSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const filtered = subjects.filter(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubjects(filtered);
  }, [searchTerm, subjects]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Предметы</h1>
      
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          placeholder="Поиск предметов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Список предметов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => (
          <Card 
            key={subject.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/student/subject/${subject.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-500">
                    {subject.topics?.length || 0} тем
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
            
            {subject.description && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{subject.description}</p>
            )}
          </Card>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Предметы не найдены</p>
        </div>
      )}
    </div>
  );
};