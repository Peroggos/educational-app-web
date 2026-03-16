import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Search, Edit, Trash2, UserPlus, Filter } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'active' | 'blocked';
  createdAt: string;
}

export const UsersManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Моковые данные
  const [users] = useState<User[]>([
    { id: '1', name: 'Иван Иванов', email: 'ivan@example.com', role: 'STUDENT', status: 'active', createdAt: '2024-01-15' },
    { id: '2', name: 'Петр Петров', email: 'petr@example.com', role: 'TEACHER', status: 'active', createdAt: '2024-01-10' },
    { id: '3', name: 'Мария Сидорова', email: 'maria@example.com', role: 'ADMIN', status: 'active', createdAt: '2024-01-05' },
    { id: '4', name: 'Анна Смирнова', email: 'anna@example.com', role: 'STUDENT', status: 'blocked', createdAt: '2024-01-01' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'TEACHER': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Управление пользователями</h1>
        <Button>
          <UserPlus size={20} className="mr-2" />
          Добавить пользователя
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              placeholder="Поиск по имени или email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Все роли</option>
              <option value="STUDENT">Ученики</option>
              <option value="TEACHER">Учителя</option>
              <option value="ADMIN">Администраторы</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Таблица пользователей */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Имя</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Роль</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Дата регистрации</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role === 'ADMIN' ? 'Администратор' : 
                       user.role === 'TEACHER' ? 'Учитель' : 'Ученик'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.createdAt}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="danger" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Пользователи не найдены</p>
          </div>
        )}
      </Card>
    </div>
  );
};