import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { TestPage } from './pages/TestPage';
import { TestResultPage } from './pages/TestResultPage';
import { ProfilePage } from './pages/ProfilePage';
import { TestApiPage } from './pages/TestApiPage';
import { ClearStoragePage } from './pages/ClearStoragePage';
import { DebugPage } from './pages/DebugPage';
import { DebugAuthPage } from './pages/DebugAuthPage';
import { LessonPage } from './pages/LessonPage';
import { CreateLessonPage } from './pages/teacher/CreateLessonPage';
import { CreateTestPage } from './pages/teacher/CreateTestPage';
// Teacher pages
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UsersManagementPage } from './pages/admin/UsersManagementPage';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/test-api" element={<TestApiPage />} />
          <Route path="/clear" element={<ClearStoragePage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/debug-auth" element={<DebugAuthPage />} />
          
          {/* Защищенные маршруты (для всех авторизованных) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Общие маршруты */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:id" element={<SubjectDetailPage />} />
              <Route path="/tests/:id" element={<TestPage />} />
              <Route path="/lessons/:id" element={<LessonPage />} />
              <Route path="/test-result/:id" element={<TestResultPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Маршруты для учителей */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleBasedRoute allowedRoles={['TEACHER', 'ADMIN']} />}>
              <Route element={<Layout />}>
                <Route path="/teacher/create-lesson/:topicId?" element={<CreateLessonPage />} />
                <Route path="/teacher/create-test" element={<CreateTestPage />} />
                <Route path="/teacher/lessons/:id" element={<LessonPage />} />
                <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
                <Route path="/teacher/subjects" element={<SubjectsPage />} />
                <Route path="/teacher/create-test" element={<div>Создание теста</div>} />
                <Route path="/teacher/edit-test/:id" element={<div>Редактирование теста</div>} />
                <Route path="/teacher/students" element={<div>Управление учениками</div>} />
              </Route>
            </Route>
          </Route>

          {/* Маршруты для администраторов */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<Layout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<UsersManagementPage />} />
                <Route path="/admin/subjects" element={<SubjectsPage />} />
                <Route path="/admin/tests" element={<div>Управление тестами</div>} />
                <Route path="/admin/statistics" element={<div>Статистика</div>} />
                <Route path="/admin/settings" element={<div>Настройки</div>} />
                <Route path="/admin/create-user" element={<div>Создание пользователя</div>} />
                <Route path="/admin/create-subject" element={<div>Создание предмета</div>} />
              </Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;