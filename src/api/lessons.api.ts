import { apiClient } from './client';
import type { Lesson, ServerResponse, CreateLessonData } from '../types/lesson.types';

export const lessonsApi = {
  // GET /api/lessons?topicId=... - все уроки (с фильтром по теме)
  getAll: async (topicId?: string): Promise<Lesson[]> => {
    const url = topicId ? `/lessons?topicId=${topicId}` : '/lessons';
    const response = await apiClient.get<ServerResponse<Lesson[]>>(url);
    return response.data.data || [];
  },

  // GET /api/lessons/topic/:topicId - уроки по теме
  getByTopic: async (topicId: string): Promise<Lesson[]> => {
    const response = await apiClient.get<ServerResponse<Lesson[]>>(`/lessons/topic/${topicId}`);
    return response.data.data || [];
  },

  // GET /api/lessons/:id - урок по ID
  getById: async (id: string): Promise<Lesson> => {
    const response = await apiClient.get<ServerResponse<Lesson>>(`/lessons/${id}`);
    return response.data.data;
  },

  // POST /api/lessons - создать урок (ADMIN/TEACHER)
  create: async (data: CreateLessonData): Promise<Lesson> => {
    const response = await apiClient.post<ServerResponse<Lesson>>('/lessons', data);
    return response.data.data;
  },

  // PATCH /api/lessons/:id - обновить урок (ADMIN/TEACHER)
  update: async (id: string, data: Partial<CreateLessonData>): Promise<Lesson> => {
    const response = await apiClient.patch<ServerResponse<Lesson>>(`/lessons/${id}`, data);
    return response.data.data;
  },

  // PATCH /api/lessons/reorder/:topicId - изменить порядок уроков
  reorder: async (topicId: string, lessonOrders: { id: string; order: number }[]): Promise<Lesson[]> => {
    const response = await apiClient.patch<ServerResponse<Lesson[]>>(`/lessons/reorder/${topicId}`, lessonOrders);
    return response.data.data;
  },

  // DELETE /api/lessons/:id - удалить урок (ADMIN)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/lessons/${id}`);
  },
};

export type { Lesson as LessonType };