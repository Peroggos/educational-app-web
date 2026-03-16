export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
  subject?: Subject;
  lessons?: Lesson[];
  questions?: Question[];
  userProgress?: UserProgress[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string;
  order: number;
  topicId: string;
  videoUrl?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  topic?: Topic;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: Difficulty;
  topicId: string;
  createdAt: string;
  updatedAt: string;
  topic?: Topic;
  testResults?: TestResult[];
}

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
  questionId?: string;
  question?: Question;
  user?: User;
  test?: Test;
}

export interface UserProgress {
  id: string;
  userId: string;
  topicId: string;
  questionsAnswered: number;
  correctAnswers: number;
  lastPracticed: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  topic?: Topic;
}

// Добавленные типы для прогресса
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

// Добавленный тип для создания вопроса
export interface CreateQuestionData {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: Difficulty;
  topicId: string;
}

export interface ServerResponse<T> {
  data: T;
  timestamp: string;
  path: string;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  content: string;
  order: number;
  topicId: string;
  videoUrl?: string;
  duration?: number;
}

export interface CreateTestData {
  name: string;
  description?: string;
  timeLimit?: number;
  questionIds: string[];
}

export interface SubmitTestData {
  answers: {
    questionId: string;
    selectedOption: number;
  }[];
}
export interface CreateLessonData {
  title: string;
  description?: string;
  content: string;
  order: number;
  topicId: string;
  videoUrl?: string;
  duration?: number;
}