import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectsApi, Subject, Topic } from '../api/subjects.api';
import { testsApi, Test } from '../api/tests.api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectData, topicsData, testsData] = await Promise.all([
          subjectsApi.getById(id!),
          subjectsApi.getTopics(id!),
          testsApi.getAll(),
        ]);
        
        setSubject(subjectData);
        setTopics(topicsData);
        setTests(testsData.filter(test => test.subjectId === id));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/subjects')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Назад к предметам
      </button>

      <h1 className="text-3xl font-bold text-gray-900">{subject?.name}</h1>
      <p className="text-gray-600">{subject?.description}</p>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Темы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Card key={topic.id}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.name}</h3>
              <p className="text-gray-600">{topic.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Тесты</h2>
        <div className="space-y-3">
          {tests.map((test) => (
            <Card key={test.id} className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                <p className="text-gray-600">{test.questionsCount} вопросов</p>
              </div>
              <Button onClick={() => navigate(`/tests/${test.id}`)}>
                Начать
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};