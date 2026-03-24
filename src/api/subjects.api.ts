import { apiClient } from './client';
import type { Subject, Topic, ServerResponse } from '../types/lesson.types';

export const subjectsApi = {
  // GET /api/subjects - все предметы
  getAll: async (): Promise<Subject[]> => {
    const response = await apiClient.get<ServerResponse<Subject[]>>('/subjects');
    return response.data.data || [];
  },

  // GET /api/subjects/:id - предмет по ID
  getById: async (id: string): Promise<Subject> => {
    const response = await apiClient.get<ServerResponse<Subject>>(`/subjects/${id}`);
    return response.data.data;
  },

  // POST /api/subjects - создать предмет (ADMIN/TEACHER)
  create: async (data: { name: string; description?: string }): Promise<Subject> => {
    const response = await apiClient.post<ServerResponse<Subject>>('/subjects', data);
    return response.data.data;
  },

  // PATCH /api/subjects/:id - обновить предмет (ADMIN/TEACHER)
  update: async (id: string, data: { name?: string; description?: string }): Promise<Subject> => {
    const response = await apiClient.patch<ServerResponse<Subject>>(`/subjects/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/subjects/:id - удалить предмет (ADMIN)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/subjects/${id}`);
  },

  // GET /api/topics?subjectId=... - темы по предмету
  getTopics: async (subjectId: string): Promise<Topic[]> => {
    const response = await apiClient.get<ServerResponse<Topic[]>>(`/topics?subjectId=${subjectId}`);
    return response.data.data || [];
  },

  // GET /api/topics/:id - тема по ID
  getTopicById: async (id: string): Promise<Topic> => {
    const response = await apiClient.get<ServerResponse<Topic>>(`/topics/${id}`);
    return response.data.data;
  },

  // POST /api/topics - создать тему (ADMIN/TEACHER)
createTopic: async (data: { name: string; description?: string; subjectId: string }): Promise<Topic> => {
  console.log('Creating topic with data:', data);
  
  if (!data.name || !data.subjectId) {
    throw new Error('Missing required fields: name and subjectId');
  }
  
  const response = await apiClient.post<ServerResponse<Topic>>('/topics', data);
  return response.data.data;
},

  // PATCH /api/topics/:id - обновить тему (ADMIN/TEACHER)
  updateTopic: async (id: string, data: { name?: string; description?: string }): Promise<Topic> => {
    const response = await apiClient.patch<ServerResponse<Topic>>(`/topics/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/topics/:id - удалить тему (ADMIN)
  deleteTopic: async (id: string): Promise<void> => {
    await apiClient.delete(`/topics/${id}`);
  },
};

export type { Subject as SubjectType, Topic as TopicType };