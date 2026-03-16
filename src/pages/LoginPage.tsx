import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi, AuthResponse } from '../api/auth.api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      
      const authData = await authApi.login(formData);
      console.log('Processed auth data:', authData);
      
      // Проверяем наличие access_token и user
      if (!authData.access_token || !authData.user) {
        console.error('Missing access_token or user:', authData);
        throw new Error('Invalid response from server');
      }

      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', authData.access_token); // Сохраняем access_token как token
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      // Проверяем, что сохранилось
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log('Saved to localStorage:', { 
        token: savedToken ? 'yes' : 'no', 
        user: savedUser ? 'yes' : 'no' 
      });
      
      toast.success('Успешный вход!');
      
      // Небольшая задержка перед редиректом
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
      
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Ошибка при входе';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Ошибка ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Сервер не отвечает. Проверьте подключение';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    setFormData({
      email: 'student2@school-trainer.com',
      password: 'password123' // Замените на правильный пароль
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Вход в систему
        </h2>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="student2@school-trainer.com"
            required
          />
          
          <Input
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Введите пароль"
            required
          />

          <Button
            type="submit"
            loading={loading}
            fullWidth
            className="mt-4"
          >
            Войти
          </Button>
        </form>

        <div className="mt-4 space-y-2">
          <button
            onClick={handleTestLogin}
            className="w-full text-sm text-primary-600 hover:text-primary-700"
          >
            Заполнить тестовые данные
          </button>
          
          <p className="text-center text-sm text-gray-600">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};