import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../../api/tests.api';
import { subjectsApi } from '../../api/subjects.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { FileText, Search, Filter, Clock } from 'lucide-react';
import type { TestType as Test } from '../../api/tests.api';
import type { SubjectType as Subject } from '../../api/subjects.api';

export const StudentTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsData, subjectsData] = await Promise.all([
          testsApi.getAll(),
          subjectsApi.getAll()
        ]);
        setTests(testsData);
        setFilteredTests(testsData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...tests];

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по предмету
    if (selectedSubject) {
      filtered = filtered.filter(() => {
        return true; // Временное решение
      });
    }

    setFilteredTests(filtered);
  }, [searchTerm, selectedSubject, tests]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Тесты</h1>

      {/* Фильтры */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              placeholder="Поиск тестов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Фильтр по предмету */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Все предметы</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Список тестов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-500">
                    {subjects.find(s => s.id === test.subjectId)?.name || 'Неизвестно'}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{test.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <FileText size={16} className="mr-1" />
                  {test.questions?.length || 0} вопросов
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {test.timeLimit || 30} мин
                </span>
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate(`/student/test/${test.id}`)}
              >
                Начать
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Тесты не найдены</p>
        </div>
      )}
    </div>
  );
};