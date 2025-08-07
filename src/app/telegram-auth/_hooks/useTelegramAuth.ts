import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TelegramUser } from '@/types/telegram';
import { getInitData } from '@/utils/telegramUtils';
import { useAuth } from '@/contexts/AuthContext';

export type AuthState =
    'loading' | 'validating' | 'success' | 'error' | 'no-data'
    | 'invalid-access' | 'logging-in' | 'already-authenticated';

export interface AuthError {
  message: string;
  details?: string;
}

export function useTelegramAuth() {
  const router = useRouter();
  const { loginWithTelegram, isAuthenticated } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [userData, setUserData] = useState<TelegramUser>();
  const [error, setError] = useState<AuthError | null>(null);

  const validateInitData = useCallback(async (data: string) => {
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
        setError({ 
          message: result.error || 'Ошибка валидации данных',
          details: result.details || 'Не удалось проверить подлинность данных Telegram'
        });
      }
    } catch (error) {
      setAuthState('error');
      setError({ 
        message: 'Ошибка соединения с сервером',
        details: 'Проверьте подключение к интернету и попробуйте снова'
      });
    }
  }, []);

  // Объединенная логика проверки аутентификации и валидации
  useEffect(() => {
    if (isAuthenticated) {
      setAuthState('already-authenticated');
      router.push('/profile');
      return;
    } else {
      // Логика валидации только если пользователь не авторизован
      const { data: initDataFromHash, error: initDataError } = getInitData();
      
      if (initDataError) {
        setAuthState('invalid-access');
        setError({ message: 'Ошибка доступа к данным авторизации', details: initDataError });
      } else if (!initDataFromHash) {
        setAuthState('no-data');
        setError({ message: 'Не удалось получить данные авторизации из Telegram', details: 'Данные авторизации отсутствуют или повреждены' });
      } else {
        // Обрабатываем Promise и добавляем validateInitData в зависимости
        validateInitData(initDataFromHash).catch(() => {
          setAuthState('error');
          setError({ 
            message: 'Ошибка валидации данных',
            details: 'Произошла непредвиденная ошибка при проверке данных'
          });
        });
      }
    }
  }, [isAuthenticated, validateInitData, router]);

  const handleLoginWithTelegram = useCallback(async () => {
    if (!userData) return;
    
    setAuthState('logging-in');
    
    try {
      await loginWithTelegram(userData);
      router.push('/profile');
    } catch (error) {
      setAuthState('error');
      setError({ 
        message: 'Ошибка входа в приложение',
        details: 'Не удалось создать сессию пользователя'
      });
    }
  }, [userData, loginWithTelegram, router]);

  return {
    authState,
    userData,
    error,
    validateInitData,
    handleLoginWithTelegram
  };
}
