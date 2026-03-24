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
  console.log('lessonsApi.create - sending data:', JSON.stringify(data, null, 2));
  
  // Проверяем обязательные поля
  if (!data.title) {
    throw new Error('Missing required field: title');
  }
  if (!data.content) {
    throw new Error('Missing required field: content');
  }
  if (!data.topicId) {
    throw new Error('Missing required field: topicId');
  }
  if (data.order === undefined) {
    throw new Error('Missing required field: order');
  }

  try {
    const response = await apiClient.post<ServerResponse<Lesson>>('/lessons', data);
    console.log('lessonsApi.create - response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('lessonsApi.create - error:', error.response?.data);
    throw error;
  }
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