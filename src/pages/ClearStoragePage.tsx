import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const ClearStoragePage: React.FC = () => {
  const navigate = useNavigate();

  const handleClear = () => {
    localStorage.clear();
    alert('Storage cleared!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Очистка хранилища</h1>
          <p className="text-gray-600">
            Это действие удалит все сохраненные данные, включая токен авторизации и информацию о пользователе.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Внимание:</strong> После очистки вам потребуется войти в систему заново.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleClear} 
            variant="danger" 
            fullWidth
          >
            <Trash2 size={20} className="mr-2" />
            Очистить localStorage
          </Button>
          
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline" 
            fullWidth
          >
            Отмена
          </Button>
        </div>
      </Card>
    </div>
  );
};