import { apiClient } from './client';
import type { ServerResponse } from '../types/lesson.types';

export interface Test {
  id: string;
  name: string;
  description?: string;
  timeLimit?: number;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption?: number;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topicId: string;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  answers: any;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface SubmitTestData {
  testId: string;
  answers: {
    questionId: string;
    selectedOption: number;
  }[];
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

  getByTopic: async (topicId: string): Promise<Test[]> => {
    const response = await apiClient.get<ServerResponse<Test[]>>(`/tests/topic/${topicId}`);
    return response.data.data || [];
  },

  getMyResults: async (): Promise<TestResult[]> => {
    const response = await apiClient.get<ServerResponse<TestResult[]>>('/tests/my-results');
    return response.data.data || [];
  },

  startTest: async (testId: string): Promise<{ attemptId: string; questions: Question[] }> => {
    const response = await apiClient.post<ServerResponse<{ attemptId: string; questions: Question[] }>>(
      `/tests/${testId}/start`,
      {}
    );
    return response.data.data;
  },

  submitTest: async (data: SubmitTestData): Promise<TestResult> => {
    const response = await apiClient.post<ServerResponse<TestResult>>('/tests/submit', data);
    return response.data.data;
  },


  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tests/${id}`);
  },

  update: async (id: string, data: Partial<Test>): Promise<Test> => {
    const response = await apiClient.patch<ServerResponse<Test>>(`/tests/${id}`, data);
    return response.data.data;
  },

  create: async (data: { name: string; description?: string; timeLimit?: number; questionIds: string[] }): Promise<Test> => {
    const response = await apiClient.post<ServerResponse<Test>>('/tests', data);
    return response.data.data;
  },
};

export type { Test as TestType, Question as QuestionType, TestResult as TestResultType };