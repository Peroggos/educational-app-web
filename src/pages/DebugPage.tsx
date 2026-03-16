import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const DebugPage: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<Record<string, any>>({});

  const refreshStorage = () => {
    const items: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          items[key] = value ? JSON.parse(value) : null;
        } catch {
          items[key] = localStorage.getItem(key);
        }
      }
    }
    setStorageInfo(items);
  };

  const clearStorage = () => {
    localStorage.clear();
    refreshStorage();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Отладка приложения</h1>
        
        <div className="space-y-6">
          {/* Информация о приложении */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Информация</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>React version:</strong> {React.version}</p>
              <p><strong>API URL:</strong> http://localhost:3000/api</p>
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            </div>
          </section>

          {/* LocalStorage */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">LocalStorage</h2>
              <div className="space-x-2">
                <Button onClick={refreshStorage} size="sm">
                  Обновить
                </Button>
                <Button onClick={clearStorage} variant="danger" size="sm">
                  Очистить
                </Button>
              </div>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(storageInfo, null, 2)}
            </pre>
          </section>

          {/* Тестовые ссылки */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Быстрые ссылки</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <a href="/login" className="text-primary-600 hover:underline">Login</a>
              <a href="/register" className="text-primary-600 hover:underline">Register</a>
              <a href="/dashboard" className="text-primary-600 hover:underline">Dashboard</a>
              <a href="/subjects" className="text-primary-600 hover:underline">Subjects</a>
              <a href="/profile" className="text-primary-600 hover:underline">Profile</a>
              <a href="/test-api" className="text-primary-600 hover:underline">Test API</a>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};