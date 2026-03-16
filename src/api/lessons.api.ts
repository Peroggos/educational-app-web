import { apiClient } from './client';
import type { 
  Lesson, 
  CreateLessonData,
  ServerResponse 
} from '../types/lesson.types';

export const lessonsApi = {
  // GET /lessons?topicId=... - получить все уроки (с опциональной фильтрацией по теме)
  getAll: async (topicId?: string): Promise<Lesson[]> => {
    const url = topicId ? `/lessons?topicId=${topicId}` : '/lessons';
    const response = await apiClient.get<ServerResponse<Lesson[]>>(url);
    return response.data.data || [];
  },

  // GET /lessons/topic/:topicId - получить уроки по теме
  getByTopic: async (topicId: string): Promise<Lesson[]> => {
    const response = await apiClient.get<ServerResponse<Lesson[]>>(`/lessons/topic/${topicId}`);
    return response.data.data || [];
  },

  // GET /lessons/:id - получить урок по ID
  getById: async (id: string): Promise<Lesson> => {
    const response = await apiClient.get<ServerResponse<Lesson>>(`/lessons/${id}`);
    return response.data.data;
  },

  // POST /lessons - создать урок (только ADMIN/TEACHER)
create: async (data: CreateLessonData): Promise<Lesson> => {
  console.log('🔵 Creating lesson with data:', JSON.stringify(data, null, 2));
  
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
    console.log('✅ Lesson created successfully:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Error creating lesson:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
},

  // PATCH /lessons/:id - обновить урок (только ADMIN/TEACHER)
  update: async (id: string, data: Partial<CreateLessonData>): Promise<Lesson> => {
    const response = await apiClient.patch<ServerResponse<Lesson>>(`/lessons/${id}`, data);
    return response.data.data;
  },

  // DELETE /lessons/:id - удалить урок (только ADMIN)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/lessons/${id}`);
  },

  // PATCH /lessons/reorder/:topicId - изменить порядок уроков (только ADMIN/TEACHER)
  reorder: async (topicId: string, lessonOrders: { id: string; order: number }[]): Promise<Lesson[]> => {
    const response = await apiClient.patch<ServerResponse<Lesson[]>>(`/lessons/reorder/${topicId}`, lessonOrders);
    return response.data.data;
  },
  
};

export type { Lesson as LessonType };