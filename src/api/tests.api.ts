import { apiClient } from './client';
import type { 
  Test, 
  Question, 
  TestResult, 
  CreateTestData, 
  SubmitTestData,
  ServerResponse 
} from '../types/lesson.types';

// Добавим тип для прогресса
export interface TestProgress {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  testsBySubject?: Record<string, number>;
}

export const testsApi = {
  getAll: async (): Promise<Test[]> => {
    const response = await apiClient.get<ServerResponse<Test[]>>('/tests');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Test> => {
    const response = await apiClient.get<ServerResponse<Test>>(`/tests/${id}`);
    return response.data.data;
  },

  getQuestions: async (testId: string): Promise<Question[]> => {
    const response = await apiClient.get<ServerResponse<Question[]>>(`/tests/${testId}/questions`);
    return response.data.data || [];
  },

  create: async (data: CreateTestData): Promise<Test> => {
    const response = await apiClient.post<ServerResponse<Test>>('/tests', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateTestData>): Promise<Test> => {
    const response = await apiClient.put<ServerResponse<Test>>(`/tests/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tests/${id}`);
  },

  startTest: async (testId: string): Promise<{ attemptId: string; questions: Question[] }> => {
    const response = await apiClient.post<ServerResponse<{ attemptId: string; questions: Question[] }>>(`/tests/${testId}/start`);
    return response.data.data;
  },

  submitTest: async (testId: string, data: SubmitTestData): Promise<TestResult> => {
    const response = await apiClient.post<ServerResponse<TestResult>>(`/tests/${testId}/submit`, data);
    return response.data.data;
  },

  getResults: async (testId: string): Promise<TestResult[]> => {
    const response = await apiClient.get<ServerResponse<TestResult[]>>(`/tests/${testId}/results`);
    return response.data.data || [];
  },

  getTestsByTopic: async (topicId: string): Promise<Test[]> => {
    const response = await apiClient.get<ServerResponse<Test[]>>(`/topics/${topicId}/tests`);
    return response.data.data || [];
  },

  // Добавляем метод getProgress
  getProgress: async (): Promise<TestProgress> => {
    const response = await apiClient.get<ServerResponse<TestProgress>>('/tests/progress');
    return response.data.data || { totalTests: 0, completedTests: 0, averageScore: 0 };
  },
};

export type { Test as TestType, Question as QuestionType, TestResult as TestResultType };