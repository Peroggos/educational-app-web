import { apiClient } from './client';
import type { Question, ServerResponse } from '../types/lesson.types';

export interface CreateQuestionData {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topicId: string;
}

export interface AnswerCheck {
  isCorrect: boolean;
  correctOption: number;
  explanation?: string;
}

export const questionsApi = {
  // GET /api/questions?topicId=... - все вопросы (с фильтром по теме)
  getAll: async (topicId?: string): Promise<Question[]> => {
    const url = topicId ? `/questions?topicId=${topicId}` : '/questions';
    const response = await apiClient.get<ServerResponse<Question[]>>(url);
    return response.data.data || [];
  },

  // GET /api/questions/:id - вопрос по ID
  getById: async (id: string): Promise<Question> => {
    const response = await apiClient.get<ServerResponse<Question>>(`/questions/${id}`);
    return response.data.data;
  },

  // POST /api/questions - создать вопрос (ADMIN/TEACHER)
  create: async (data: CreateQuestionData): Promise<Question> => {
    const response = await apiClient.post<ServerResponse<Question>>('/questions', data);
    return response.data.data;
  },

  // POST /api/questions/:id/check - проверить ответ
  checkAnswer: async (questionId: string, selectedOption: number): Promise<AnswerCheck> => {
    const response = await apiClient.post<ServerResponse<AnswerCheck>>(`/questions/${questionId}/check`, { selectedOption });
    return response.data.data;
  },

  // PATCH /api/questions/:id - обновить вопрос (ADMIN/TEACHER)
  update: async (id: string, data: Partial<CreateQuestionData>): Promise<Question> => {
    const response = await apiClient.patch<ServerResponse<Question>>(`/questions/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/questions/:id - удалить вопрос (ADMIN)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/questions/${id}`);
  },
};

export type { Question as QuestionType };