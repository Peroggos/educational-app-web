import { apiClient } from './client';
import type { 
  OverallProgress, 
  TopicProgress, 
  UserProgress,
  ServerResponse 
} from '../types/lesson.types';

export const progressApi = {
  getOverall: async (): Promise<OverallProgress> => {
    const response = await apiClient.get<ServerResponse<OverallProgress>>('/progress/overall');
    return response.data.data;
  },

  getByTopic: async (topicId: string): Promise<TopicProgress> => {
    const response = await apiClient.get<ServerResponse<TopicProgress>>(`/progress/topics/${topicId}`);
    return response.data.data;
  },

  getAllTopics: async (): Promise<UserProgress[]> => {
    const response = await apiClient.get<ServerResponse<UserProgress[]>>('/progress/topics');
    return response.data.data || [];
  },

  getStats: async (): Promise<{
    totalTests: number;
    averageScore: number;
    totalTime: number;
    streak: number;
    rank?: number;
  }> => {
    const response = await apiClient.get<ServerResponse<any>>('/progress/stats');
    return response.data.data;
  },

  updateAfterAnswer: async (data: {
    topicId: string;
    questionId: string;
    isCorrect: boolean;
  }): Promise<UserProgress> => {
    const response = await apiClient.post<ServerResponse<UserProgress>>('/progress/update', data);
    return response.data.data;
  },
};

export type { OverallProgress as OverallProgressType, TopicProgress as TopicProgressType };