import { apiClient } from './client';
import type { 
  Subject, 
  Topic, 
  ServerResponse 
} from '../types/lesson.types';

export const subjectsApi = {
  // GET /subjects - получить все предметы
  getAll: async (): Promise<Subject[]> => {
    const response = await apiClient.get<ServerResponse<Subject[]>>('/subjects');
    return response.data.data || [];
  },

  // GET /subjects/:id - получить предмет по ID
  getById: async (id: string): Promise<Subject> => {
    const response = await apiClient.get<ServerResponse<Subject>>(`/subjects/${id}`);
    return response.data.data;
  },

  // GET /topics?subjectId=... - получить темы по предмету
  getTopics: async (subjectId: string): Promise<Topic[]> => {
    const response = await apiClient.get<ServerResponse<Topic[]>>(`/topics?subjectId=${subjectId}`);
    return response.data.data || [];
  },

  // GET /topics/:id - получить тему по ID
  getTopicById: async (id: string): Promise<Topic> => {
    const response = await apiClient.get<ServerResponse<Topic>>(`/topics/${id}`);
    return response.data.data;
  },

  // POST /subjects - создать предмет (ADMIN only)
  createSubject: async (data: { name: string; description?: string }): Promise<Subject> => {
    const response = await apiClient.post<ServerResponse<Subject>>('/subjects', data);
    return response.data.data;
  },

  // POST /topics - создать тему (TEACHER, ADMIN)
  createTopic: async (data: { name: string; description?: string; subjectId: string }): Promise<Topic> => {
    const response = await apiClient.post<ServerResponse<Topic>>('/topics', data);
    return response.data.data;
  },
};

export type { Subject as SubjectType, Topic as TopicType };