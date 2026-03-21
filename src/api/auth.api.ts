import { apiClient } from './client';
import type { User, ServerResponse } from '../types/lesson.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  // POST /api/auth/register - регистрация
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ServerResponse<AuthResponse>>('/auth/register', credentials);
    return response.data.data;
  },

  // POST /api/auth/login - вход
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ServerResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  // POST /api/auth/refresh - обновление токена
  refreshToken: async (): Promise<{ access_token: string }> => {
    const response = await apiClient.post<ServerResponse<{ access_token: string }>>('/auth/refresh');
    return response.data.data;
  },

  // POST /api/auth/logout - выход
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // GET /api/auth/test-token - проверка токена
  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/auth/test-token');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  // GET /api/users/profile - получить профиль
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ServerResponse<User>>('/users/profile');
    return response.data.data;
  },

  // GET /api/users - все пользователи (ADMIN)
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ServerResponse<User[]>>('/users');
    return response.data.data || [];
  },

  // PATCH /api/users/:id - обновить пользователя (ADMIN)
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<ServerResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/users/:id - удалить пользователя (ADMIN)
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};