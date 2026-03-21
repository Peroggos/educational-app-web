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
  results?: TestResult[];
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
  testId: string;
  testName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number;
  completedAt: Date;
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

startTest: async (testId: string): Promise<any> => {
  console.log('Starting test with testId:', testId);
  
  if (!testId) {
    throw new Error('testId is required');
  }

  try {
    const response = await apiClient.post<ServerResponse<any>>(
      `/tests/${testId}/start`,
      {}
    );
    console.log('Start test response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Start test error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      testId
    });
    throw error;
  }
},

  submitTest: async (data: SubmitTestData): Promise<TestResult> => {
    console.log('Submitting test with data:', data);
    const response = await apiClient.post<ServerResponse<TestResult>>('/tests/submit', data);
    return response.data.data;
  },
};