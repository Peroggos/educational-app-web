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
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ServerResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ServerResponse<AuthResponse>>('/auth/register', credentials);
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ServerResponse<User>>('/users/profile');
    return response.data.data;
  },
};