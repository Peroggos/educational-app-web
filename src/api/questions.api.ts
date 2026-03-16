import { apiClient } from './client';
import type { 
  Question, 
  CreateQuestionData,
  ServerResponse 
} from '../types/lesson.types';

export const questionsApi = {
  getByTopic: async (topicId: string): Promise<Question[]> => {
    const response = await apiClient.get<ServerResponse<Question[]>>(`/topics/${topicId}/questions`);
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Question> => {
    const response = await apiClient.get<ServerResponse<Question>>(`/questions/${id}`);
    return response.data.data;
  },

  create: async (data: CreateQuestionData): Promise<Question> => {
    const response = await apiClient.post<ServerResponse<Question>>('/questions', data);
    return response.data.data;
  },

  createBulk: async (questions: CreateQuestionData[]): Promise<Question[]> => {
    const response = await apiClient.post<ServerResponse<Question[]>>('/questions/bulk', { questions });
    return response.data.data || [];
  },

  update: async (id: string, data: Partial<CreateQuestionData>): Promise<Question> => {
    const response = await apiClient.put<ServerResponse<Question>>(`/questions/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/questions/${id}`);
  },
};

export type { Question as QuestionType };