import { apiClient } from './client';
import type { User, ServerResponse } from '../types/lesson.types';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<ServerResponse<User[]>>('/users');
    return response.data.data || [];
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ServerResponse<User>>('/users/profile');
    return response.data.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ServerResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<ServerResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  changeRole: async (id: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN'): Promise<User> => {
    const response = await apiClient.patch<ServerResponse<User>>(`/users/${id}/role`, { role });
    return response.data.data;
  },
};

export type { User as UserType };