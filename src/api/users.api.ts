import { apiClient } from './client';
import type { User } from '../types/lesson.types';

interface ServerResponse<T> {
  data: T;
  timestamp: string;
  path: string;
}

export const usersApi = {
  // Получить всех пользователей (ADMIN only)
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<ServerResponse<User[]>>('/users');
    return response.data.data || [];
  },

  // Получить пользователя по ID (ADMIN only)
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ServerResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Создать пользователя (ADMIN only)
  create: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }): Promise<User> => {
    const response = await apiClient.post<ServerResponse<User>>('/users', data);
    return response.data.data;
  },

  // Обновить пользователя (ADMIN only)
  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ServerResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  // Удалить пользователя (ADMIN only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Изменить роль пользователя (ADMIN only)
  changeRole: async (id: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN'): Promise<User> => {
    const response = await apiClient.patch<ServerResponse<User>>(`/users/${id}/role`, { role });
    return response.data.data;
  },

  // Получить статистику пользователя (ADMIN only)
  getUserStats: async (id: string): Promise<{
    totalTests: number;
    averageScore: number;
    topicsCompleted: number;
    lastActive: string;
  }> => {
    const response = await apiClient.get<ServerResponse<any>>(`/users/${id}/stats`);
    return response.data.data;
  },
};

export type { User as UserType };