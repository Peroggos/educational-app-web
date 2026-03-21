import { apiClient } from './client';
import type { ServerResponse } from '../types/lesson.types';

export interface OverallProgress {
  totalTopics: number;
  completedTopics: number;
  totalQuestions: number;
  correctAnswers: number;
  overallAccuracy: number;
  topicsProgress: TopicProgress[];
}

export interface TopicProgress {
  topicId: string;
  topicName: string;
  subjectName: string;
  questionsAnswered: number;
  correctAnswers: number;
  lastPracticed: string;
  accuracy: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  topicId: string;
  questionsAnswered: number;
  correctAnswers: number;
  lastPracticed: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface UserStats {
  totalTests: number;
  averageScore: number;
  totalTime: number;
  streak: number;
  rank?: number;
}

export const progressApi = {
  // GET /api/progress - мой прогресс
  getMyProgress: async (): Promise<OverallProgress> => {
    const response = await apiClient.get<ServerResponse<OverallProgress>>('/progress');
    return response.data.data;
  },

  // GET /api/progress/stats - моя статистика
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<ServerResponse<UserStats>>('/progress/stats');
    return response.data.data;
  },

  // GET /api/progress/achievements - мои достижения
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await apiClient.get<ServerResponse<Achievement[]>>('/progress/achievements');
    return response.data.data || [];
  },

  // GET /api/progress/subject/:subjectId - прогресс по предмету
  getSubjectProgress: async (subjectId: string): Promise<TopicProgress[]> => {
    const response = await apiClient.get<ServerResponse<TopicProgress[]>>(`/progress/subject/${subjectId}`);
    return response.data.data || [];
  },

  // GET /api/progress/topic/:topicId - прогресс по теме
  getTopicProgress: async (topicId: string): Promise<TopicProgress> => {
    const response = await apiClient.get<ServerResponse<TopicProgress>>(`/progress/topic/${topicId}`);
    return response.data.data;
  },

  // POST /api/progress/update - обновить прогресс
  updateProgress: async (data: { topicId: string; questionId: string; isCorrect: boolean }): Promise<UserProgress> => {
    const response = await apiClient.post<ServerResponse<UserProgress>>('/progress/update', data);
    return response.data.data;
  },

  // POST /api/progress/check-achievements - проверить достижения
  checkAchievements: async (): Promise<Achievement[]> => {
    const response = await apiClient.post<ServerResponse<Achievement[]>>('/progress/check-achievements');
    return response.data.data || [];
  },
};

export type { OverallProgress as OverallProgressType, TopicProgress as TopicProgressType };