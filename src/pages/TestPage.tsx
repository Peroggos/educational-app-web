import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testsApi, Question, TestResult } from '../api/tests.api';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const TestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testInfo, setTestInfo] = useState<any>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const [testData, questionsData] = await Promise.all([
          testsApi.getById(id!),
          testsApi.getQuestions(id!),
        ]);
        
        setTestInfo(testData);
        setQuestions(questionsData);
        setAnswers(new Array(questionsData.length).fill(-1));
        
        if (testData.timeLimit) {
          setTimeLeft(testData.timeLimit * 60);
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleAnswer = () => {
    if (selectedOption === -1) {
      toast.error('Выберите ответ');
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(newAnswers[currentQuestion + 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await testsApi.submitTest(id!, answers);
      navigate(`/test-result/${id}`, { state: { result } });
    } catch (error) {
      console.error('Error submitting test:', error);
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

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Вопрос {currentQuestion + 1} из {questions.length}
        </h1>
        {timeLeft > 0 && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock size={20} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <Card>
        <h2 className="text-xl text-gray-900 mb-6">{question.text}</h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`
                block p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedOption === index 
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
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setSelectedOption(answers[currentQuestion - 1]);
              }
            }}
            disabled={currentQuestion === 0}
          >
            Назад
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
      </Card>
    </div>
  );
};