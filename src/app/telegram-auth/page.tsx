"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TelegramUser } from '@/types/telegram';
import { getInitData } from '@/utils/telegramUtils';
import { useAuth } from '@/contexts/AuthContext';

type AuthState = 'loading' | 'validating' | 'success' | 'error' | 'no-data' | 'invalid-access' | 'logging-in';

const ProgressSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { title: 'Загрузка', icon: '📱' },
    { title: 'Проверка', icon: '🔐' },
    { title: 'Вход', icon: '🚀' },
    { title: 'Готово', icon: '✅' }
  ];

  return (
    <div className="flex justify-center mb-6 px-4">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
              index < currentStep 
                ? 'bg-green-500 border-green-500 text-white' 
                : index === currentStep 
                ? 'bg-blue-500 border-blue-500 text-white animate-pulse' 
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              <span className="text-xs sm:text-sm">{step.icon}</span>
            </div>
            <span className={`mt-1 text-xs sm:text-sm font-medium text-center ${
              index <= currentStep ? 'text-gray-800' : 'text-gray-400'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`hidden sm:block w-6 h-0.5 mx-2 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TelegramAuthPage = () => {
  const router = useRouter();
  const { loginTelegram } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [userData, setUserData] = useState<TelegramUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const { data: initDataFromHash, error: initDataError } = getInitData();
    
    if (initDataError) {
      setAuthState('invalid-access');
      setErrorMessage('Ошибка доступа к данным авторизации');
      setErrorDetails(initDataError);
    } else if (!initDataFromHash) {
      setAuthState('no-data');
      setErrorMessage('Не удалось получить данные авторизации из Telegram');
      setErrorDetails('Данные авторизации отсутствуют или повреждены');
    } else {
      validateInitData(initDataFromHash);
    }
  }, []);

  const validateInitData = async (data: string) => {
    setAuthState('validating');
    
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: data }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.user) {
        setUserData(result.user);
        setAuthState('success');
      } else {
        setAuthState('error');
        setErrorMessage(result.error || 'Ошибка валидации данных');
        setErrorDetails(result.details || 'Не удалось проверить подлинность данных Telegram');
      }
    } catch (error) {
      setAuthState('error');
      setErrorMessage('Ошибка соединения с сервером');
      setErrorDetails('Проверьте подключение к интернету и попробуйте снова');
    }
  };

  const handleLogin = async () => {
    if (!userData) return;
    
    setAuthState('logging-in');
    
    try {
      await loginTelegram(userData);
      // Успешная аутентификация, перенаправляем в профиль
      router.push('/profile');
    } catch (error) {
      setAuthState('error');
      setErrorMessage('Ошибка входа в приложение');
      setErrorDetails('Не удалось создать сессию пользователя');
    }
  };

  const getCurrentStep = () => {
    switch (authState) {
      case 'loading': return 0;
      case 'validating': return 1;
      case 'success': return 2;
      case 'logging-in': return 2;
      case 'error': return 1;
      case 'no-data': return 0;
      case 'invalid-access': return 0;
      default: return 0;
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const ValidationSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
    </div>
  );

  const LoginSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  const ErrorIcon = () => (
    <div className="flex items-center justify-center">
      <div className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-red-100 flex items-center justify-center">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>
  );

  const UserProfile = () => {
    if (!userData) return null;

    return (
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
        <div className="text-center">
          {/* User Avatar */}
          <div className="mb-4 sm:mb-6">
            {userData.photo_url ? (
              <img 
                src={userData.photo_url} 
                alt="Profile" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto border-4 border-blue-100 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                {userData.first_name?.[0] || 'U'}
              </div>
            )}
          </div>

          {/* User Info */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {userData.first_name} {userData.last_name}
          </h2>
          
          {userData.username && (
            <p className="text-gray-600 mb-4 text-sm sm:text-base">@{userData.username}</p>
          )}

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-6">
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium text-sm sm:text-base">Данные проверены!</span>
            </div>
          </div>

          {/* Go to App Button */}
          <button 
            onClick={handleLogin}
            disabled={authState === 'logging-in'}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center">
              {authState === 'logging-in' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  <span>Вход в приложение...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Перейти в приложение
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    );
  };

  const ErrorState = () => (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <ErrorIcon />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4 mb-2">
          Ошибка авторизации
        </h2>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">{errorMessage}</p>
        {errorDetails && (
          <p className="text-gray-500 mb-6 text-xs sm:text-sm">{errorDetails}</p>
        )}
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Попробовать снова
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );

  const InvalidAccessState = () => (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <div className="rounded-full h-10 w-10 sm:h-12 sm:h-12 bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Неправильный доступ
        </h2>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">{errorMessage}</p>
        {errorDetails && (
          <p className="text-gray-500 mb-6 text-xs sm:text-sm">{errorDetails}</p>
        )}
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-left">
              <p className="text-orange-800 font-medium text-xs sm:text-sm mb-1">Как правильно войти:</p>
              <ul className="text-orange-700 text-xs sm:text-sm space-y-1">
                <li>• Откройте приложение в Telegram</li>
                <li>• Используйте кнопку &#34;Открыть приложение&#34;</li>
                <li>• Не переходите по прямой ссылке</li>
              </ul>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/')}
          className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );

  const NoDataState = () => (
    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm mx-auto">
      <div className="text-center">
        <div className="rounded-full h-10 w-10 sm:h-12 sm:h-12 bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Данные не найдены
        </h2>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">{errorMessage}</p>
        {errorDetails && (
          <p className="text-gray-500 mb-6 text-xs sm:text-sm">{errorDetails}</p>
        )}
        
        <button 
          onClick={() => router.push('/')}
          className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 pt-4 sm:pt-20 pb-20'>
      <div className='w-full max-w-sm sm:max-w-md'>
        {/* Header */}
        <div className='text-center mb-6 sm:mb-8'>
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className='text-2xl sm:text-4xl font-bold text-gray-800'>Авторизация</h1>
          </div>
          <p className='text-gray-600 text-sm sm:text-base'>Подключение к Telegram Mini App</p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={getCurrentStep()} />

        {/* Main Content */}
        <div className='w-full'>
          {authState === 'loading' && (
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 text-center">
              <LoadingSpinner />
              <p className="text-gray-600 mt-4 text-sm sm:text-base">Загрузка данных авторизации...</p>
            </div>
          )}

          {authState === 'validating' && (
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 text-center">
              <ValidationSpinner />
              <p className="text-gray-600 mt-4 text-sm sm:text-base">Проверка данных Telegram...</p>
            </div>
          )}

          {authState === 'logging-in' && (
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 text-center">
              <LoginSpinner />
              <p className="text-gray-600 mt-4 text-sm sm:text-base">Вход в приложение...</p>
            </div>
          )}

          {authState === 'success' && <UserProfile />}
          {authState === 'error' && <ErrorState />}
          {authState === 'no-data' && <NoDataState />}
          {authState === 'invalid-access' && <InvalidAccessState />}
        </div>
      </div>
    </div>
  );
};

export default TelegramAuthPage;