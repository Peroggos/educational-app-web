#  Документация образовательной платформы

## Обзор

Образовательная платформа - это веб-приложение для онлайн-обучения, разработанное на React с TypeScript и TailwindCSS. Платформа поддерживает три роли пользователей: **Студент**, **Учитель** и **Администратор**.

---

##  Быстрый старт

### Установка и запуск

```bash
# Клонирование репозитория
git clone <repository-url>
cd educational-app-web

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

### Конфигурация

Создайте файл `.env` в корне проекта:
```env
VITE_API_URL=http://localhost:3000/api
```

---

##  Архитектура приложения

### Структура проекта

```
src/
├── api/                 # API клиенты
│   ├── client.ts        # Axios клиент с интерцепторами
│   ├── auth.api.ts      # Аутентификация
│   ├── subjects.api.ts  # Предметы и темы
│   ├── tests.api.ts     # Тесты
│   ├── lessons.api.ts   # Уроки
│   ├── questions.api.ts # Вопросы
│   ├── users.api.ts     # Пользователи (админ)
│   └── progress.api.ts  # Прогресс и достижения
├── components/          # React компоненты
│   ├── common/          # Переиспользуемые компоненты
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── Layout.tsx       # Основной layout
│   ├── StudentLayout.tsx # Layout для студентов
│   ├── ProtectedRoute.tsx # Защита маршрутов
│   └── RoleBasedRoute.tsx # Защита по ролям
├── pages/               # Страницы приложения
│   ├── auth/            # Аутентификация
│   ├── student/         # Страницы студента
│   ├── teacher/         # Страницы учителя
│   └── admin/           # Страницы администратора
├── types/               # TypeScript типы
├── utils/               # Утилиты
├── styles/              # Стили (Tailwind)
└── App.tsx              # Главный компонент
```

---

##  Аутентификация

### Вход в систему

```typescript
import { authApi } from './api/auth.api';

// Логин
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Сохранение токена
localStorage.setItem('token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));
```

### Регистрация

```typescript
const response = await authApi.register({
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'Иван',
  lastName: 'Петров'
});
```

### Проверка авторизации

```typescript
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAuthenticated = !!token;
const userRole = user?.role; // 'STUDENT' | 'TEACHER' | 'ADMIN'
```

---

##  Роли пользователей

### Студент

**Доступные страницы:**
- `/student` - Главная панель студента
- `/student/subjects` - Список предметов
- `/student/subject/:id` - Детали предмета с темами
- `/student/tests` - Список тестов
- `/student/test/:id` - Прохождение теста
- `/student/lesson/:id` - Просмотр урока
- `/student/history` - История пройденных тестов
- `/student/progress` - Прогресс обучения
- `/student/achievements` - Достижения
- `/student/profile` - Профиль пользователя

**Возможности:**
- Просмотр предметов и тем
- Изучение уроков
- Прохождение тестов
- Отслеживание прогресса
- Получение достижений

### Учитель

**Доступные страницы:**
- `/teacher/dashboard` - Панель учителя
- `/teacher/subjects` - Управление предметами
- `/teacher/lessons` - Управление уроками
- `/teacher/tests` - Управление тестами
- `/teacher/create-lesson` - Создание урока
- `/teacher/create-test` - Создание теста
- `/teacher/create-topic` - Создание темы

**Возможности:**
- Создание и редактирование уроков
- Создание и редактирование тестов
- Управление темами
- Просмотр статистики

### Администратор

**Доступные страницы:**
- `/admin/dashboard` - Панель администратора
- `/admin/users` - Управление пользователями
- `/admin/subjects` - Управление предметами
- `/admin/create-subject` - Создание предмета

**Возможности:**
- Полное управление пользователями
- Создание предметов
- Управление всеми материалами
- Просмотр статистики платформы

---

##  API Клиенты

### Аутентификация (auth.api.ts)

```typescript
// Вход
authApi.login(credentials: LoginCredentials): Promise<AuthResponse>

// Регистрация
authApi.register(credentials: RegisterCredentials): Promise<AuthResponse>

// Получение профиля
authApi.getProfile(): Promise<User>
```

### Предметы и темы (subjects.api.ts)

```typescript
// Получить все предметы
subjectsApi.getAll(): Promise<Subject[]>

// Получить предмет по ID
subjectsApi.getById(id: string): Promise<Subject>

// Получить темы предмета
subjectsApi.getTopics(subjectId: string): Promise<Topic[]>

// Создать тему
subjectsApi.createTopic(data: { name: string; description?: string; subjectId: string }): Promise<Topic>
```

### Уроки (lessons.api.ts)

```typescript
// Получить уроки по теме
lessonsApi.getByTopic(topicId: string): Promise<Lesson[]>

// Получить урок по ID
lessonsApi.getById(id: string): Promise<Lesson>

// Создать урок
lessonsApi.create(data: CreateLessonData): Promise<Lesson>

// Обновить урок
lessonsApi.update(id: string, data: Partial<CreateLessonData>): Promise<Lesson>

// Удалить урок
lessonsApi.delete(id: string): Promise<void>
```

### Тесты (tests.api.ts)

```typescript
// Получить все тесты
testsApi.getAll(): Promise<Test[]>

// Получить тест по ID
testsApi.getById(id: string): Promise<Test>

// Начать тест
testsApi.startTest(testId: string): Promise<{ attemptId: string; questions: Question[] }>

// Отправить ответы
testsApi.submitTest(data: SubmitTestData): Promise<TestResult>

// Получить результаты
testsApi.getMyResults(): Promise<TestResult[]>
```

### Прогресс (progress.api.ts)

```typescript
// Получить общий прогресс
progressApi.getMyProgress(): Promise<OverallProgress>

// Получить статистику
progressApi.getStats(): Promise<UserStats>

// Получить достижения
progressApi.getAchievements(): Promise<Achievement[]>

// Проверить новые достижения
progressApi.checkAchievements(): Promise<Achievement[]>
```

---

##  UI Компоненты

### Button

```tsx
<Button 
  variant="primary"      // primary | secondary | outline | danger
  size="md"              // sm | md | lg
  loading={false}        // Показать спиннер
  fullWidth              // На всю ширину
  onClick={handleClick}
>
  Нажми меня
</Button>
```

### Input

```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  placeholder="Введите email"
  required
/>
```

### Card

```tsx
<Card className="cursor-pointer hover:shadow-lg">
  <h3 className="text-lg font-semibold">Заголовок</h3>
  <p className="text-gray-600">Содержимое карточки</p>
</Card>
```

---

## Защита маршрутов

### ProtectedRoute

Защищает маршруты от неавторизованных пользователей:

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

### RoleBasedRoute

Защищает маршруты по ролям:

```tsx
<Route element={<RoleBasedRoute allowedRoles={['TEACHER', 'ADMIN']} />}>
  <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
</Route>
```

---

## Типы данных

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}
```

### Subject
```typescript
interface Subject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
}
```

### Topic
```typescript
interface Topic {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  lessons?: Lesson[];
  questions?: Question[];
}
```

### Lesson
```typescript
interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string;
  order: number;
  topicId: string;
  videoUrl?: string;
  duration?: number;
}
```

### Test
```typescript
interface Test {
  id: string;
  name: string;
  description?: string;
  timeLimit?: number;
  questions?: Question[];
  results?: TestResult[];
}
```

### Question
```typescript
interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topicId: string;
}
```

---

##  Отладка

### Страницы отладки

- `/debug` - Общая отладка
- `/debug-auth` - Отладка аутентификации
- `/debug-tests` - Отладка тестов
- `/debug-lesson-api` - Отладка API уроков
- `/debug-start-test` - Отладка начала теста
- `/debug-submit-format` - Отладка отправки теста
- `/clear` - Очистка localStorage

### Консоль разработчика

```javascript
// Проверить состояние авторизации
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('Token:', localStorage.getItem('token'));

// Проверить API
fetch('http://localhost:3000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

##  Деплой

### Сборка для продакшена

```bash
npm run build
```

### Запуск на сервере

```bash
# Установка serve
npm install -g serve

# Запуск
serve -s dist -l 3001
```



##  Примеры использования

### Создание урока (учитель)

```typescript
const lessonData = {
  title: 'Введение в React',
  description: 'Основы React',
  content: '<h1>Что такое React?</h1><p>React - библиотека для UI</p>',
  order: 1,
  topicId: 'topic_id',
  duration: 45
};

const newLesson = await lessonsApi.create(lessonData);
```

### Прохождение теста (студент)

```typescript
// Начать тест
const { attemptId, questions } = await testsApi.startTest(testId);

// Сохранить ответы
const answers = questions.map((q, i) => ({
  questionId: q.id,
  selectedOption: selectedAnswers[i]
}));

// Отправить ответы
const result = await testsApi.submitTest({
  testId,
  answers
});
```

### Получение прогресса

```typescript
const progress = await progressApi.getMyProgress();
console.log(`Точность: ${progress.overallAccuracy}%`);
console.log(`Пройдено тем: ${progress.completedTopics}`);
```

---

## Лицензия

MIT License

---

