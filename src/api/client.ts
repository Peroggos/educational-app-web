import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Добавляем токен к запросам
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Request:', {
    url: config.url,
    method: config.method,
    token: token ? 'present' : 'missing'
  });
  
  if (token) {
    // Отправляем токен в формате Bearer
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ответов
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    const message = error.response?.data?.message || 'Произошла ошибка';
    
    if (!(error.config?.url?.includes('/auth/login') && error.response?.status === 401)) {
      toast.error(message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);