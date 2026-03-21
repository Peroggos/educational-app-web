import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testsApi } from '../api/tests.api';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption?: number;
}

export const TestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

useEffect(() => {
  const startTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== STARTING TEST ===');
      console.log('Test ID:', id);
      
      if (!id) {
        throw new Error('ID теста не указан');
      }

      // 1. Сначала получаем информацию о тесте
      console.log('1. Getting test info...');
      const testData = await testsApi.getById(id);
      console.log('Test data:', testData);
      setTest(testData);
      
      if (testData.timeLimit) {
        setTimeLeft(testData.timeLimit * 60);
      }

      // 2. Начинаем тест (создаем сессию)
      console.log('2. Creating test session...');
      const startData = await testsApi.startTest(id);
      console.log('Start test response:', startData);
      
      // Проверяем структуру ответа
      let sessionId = null;
      
      if (startData.attemptId) {
        sessionId = startData.attemptId;
      } else if (startData.session) {
        // Если есть поле session, берем его id
        sessionId = startData.session.id || startData.session.attemptId;
        console.log('Found session ID in session object:', sessionId);
      } else if (startData.id) {
        // Если сам объект является сессией
        sessionId = startData.id;
      }
      
      if (!sessionId) {
        console.error('Could not find session ID in response!', startData);
        throw new Error('Сервер не вернул ID сессии');
      }
      
      setAttemptId(sessionId);
      console.log('✅ Session created with ID:', sessionId);
      
      // Получаем вопросы
      let questionsList = null;
      if (startData.questions && startData.questions.length > 0) {
        questionsList = startData.questions;
      } else if (startData.session && startData.session.questions) {
        questionsList = startData.session.questions;
      } else if (startData.test && startData.test.questions) {
        questionsList = startData.test.questions;
      }
      
      if (!questionsList || questionsList.length === 0) {
        console.error('No questions in response!', startData);
        throw new Error('В тесте нет вопросов');
      }
      
      setQuestions(questionsList);
      setAnswers({});
      console.log('✅ Loaded', questionsList.length, 'questions');

    } catch (error: any) {
      console.error('❌ Error starting test:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Не удалось начать тест');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    startTest();
  }
}, [id]);

  // Таймер
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 0) {
          return prev - 1;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Автоматическая отправка при истечении времени
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
      toast.error('Время вышло! Тест автоматически завершен.');
    }
  }, [timeLeft]);

  // Обновляем selectedOption при смене вопроса
  useEffect(() => {
    const savedAnswer = answers[currentQuestion];
    console.log(`Question ${currentQuestion} - saved answer:`, savedAnswer);
    setSelectedOption(savedAnswer !== undefined ? savedAnswer : -1);
  }, [currentQuestion, answers]);

  const handleAnswer = () => {
    console.log('=== handleAnswer called ===');
    console.log('Selected option:', selectedOption);
    console.log('Current question index:', currentQuestion);
    
    if (selectedOption === -1) {
      toast.error('Выберите ответ');
      return;
    }

    // Сохраняем ответ
    const newAnswers = { ...answers, [currentQuestion]: selectedOption };
    console.log('Updated answers:', newAnswers);
    setAnswers(newAnswers);
    
    // Если это последний вопрос, показываем сообщение
    if (currentQuestion === questions.length - 1) {
      console.log('This is the last question!');
      toast.success('Вы ответили на все вопросы! Нажмите "Завершить тест"');
    } else {
      // Переходим к следующему вопросу
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!attemptId) {
        toast.error('Сессия теста не найдена. Пожалуйста, обновите страницу.');
        return;
      }

      // Получаем все вопросы, на которые есть ответы
      const answeredQuestions = Object.keys(answers).length;
      const totalQuestions = questions.length;
      
      console.log('Answers object:', answers);
      console.log('Answered questions:', answeredQuestions, 'of', totalQuestions);
      
      // Если нет отвеченных вопросов
      if (answeredQuestions === 0) {
        toast.error('Вы не ответили ни на один вопрос');
        return;
      }

      // Проверяем, все ли вопросы отвечены
      if (answeredQuestions < totalQuestions) {
        const confirm = window.confirm(`Вы ответили только на ${answeredQuestions} из ${totalQuestions} вопросов. Всё равно завершить?`);
        if (!confirm) return;
      }

      // Формируем ответы для отправки
      const answersToSubmit = Object.entries(answers).map(([questionIndex, selectedOption]) => ({
        questionId: questions[parseInt(questionIndex)].id,
        selectedOption: selectedOption
      }));

      console.log('Submitting answers:', answersToSubmit);

      const submitData = {
        testId: id!,
        answers: answersToSubmit
      };

      console.log('Submit data:', submitData);

      const result = await testsApi.submitTest(submitData);
      console.log('Test result:', result);
      
      toast.success('Тест завершен!');
      navigate(`/test-result/${id}`, { state: { result } });
    } catch (error: any) {
      console.error('Error submitting test:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 404) {
        toast.error('Сессия теста истекла. Пожалуйста, начните тест заново.');
        // Перенаправляем на страницу теста для перезапуска
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(error.response?.data?.message || 'Ошибка при отправке теста');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Тест не найден или не содержит вопросов</p>
        <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const currentAnswer = answers[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Заголовок теста */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{test.name}</h1>
          <p className="text-gray-600 text-sm mt-1">
            Вопрос {currentQuestion + 1} из {questions.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Отвечено: {answeredCount} из {questions.length}
          </p>
        </div>
        {timeLeft !== null && (
          <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Clock size={20} className="text-primary-600" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Прогресс бар */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Вопрос */}
      <Card>
        <h2 className="text-xl text-gray-900 mb-6">{question.text}</h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`
                block p-4 border rounded-lg cursor-pointer transition-colors
                ${currentAnswer === index 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={currentAnswer === index}
                  onChange={() => {
                    console.log(`Selected option ${index}:`, option);
                    setSelectedOption(index);
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Навигация */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Назад
          </Button>

          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm('Вы уверены, что хотите завершить тест досрочно?')) {
                  handleSubmit();
                }
              }}
            >
              Завершить
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmit}>
                Завершить тест
              </Button>
            ) : (
              <Button onClick={handleAnswer}>
                Далее
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Индикатор отвеченных вопросов */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-colors
              ${index === currentQuestion 
                ? 'bg-primary-600 text-white' 
                : answers[index] !== undefined
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};