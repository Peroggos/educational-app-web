import React, { useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar, Shield } from 'lucide-react';
import { User } from '../types/lesson.types'; // Импортируем из правильного места

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await authApi.getProfile();
        setProfile(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getRoleName = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'Администратор';
      case 'TEACHER': return 'Учитель';
      default: return 'Ученик';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Не удалось загрузить профиль</p>
        <Button onClick={() => navigate('/dashboard')}>
          На главную
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
      
      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="text-primary-600" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Роль</p>
              <p className="font-medium text-gray-900">{getRoleName(profile.role)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Дата регистрации</p>
              <p className="font-medium text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};