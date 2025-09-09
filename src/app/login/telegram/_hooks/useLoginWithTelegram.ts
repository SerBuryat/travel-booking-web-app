import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {TelegramUserData} from '@/types/telegram';
import { getInitData } from '@/utils/telegramUtils';
import { useAuth } from '@/contexts/AuthContext';
import { PAGE_ROUTES } from '@/utils/routes';
import {ApiService} from "@/service/ApiService";

export enum TelegramAuthState {
  LOADING,
  VALIDATING,
  SUCCESS,
  ERROR,
  NO_DATA,
  INVALID_ACCESS,
  LOGGING_IN,
  ALREADY_AUTHENTICATED
}

export interface TelegramInitDataValidationError {
  message: string;
  details?: string;
}

export function useLoginWithTelegram() {
  const router = useRouter();

  const { loginWithTelegram, isAuthenticated } = useAuth();

  const [authState, setAuthState] = useState<TelegramAuthState>(TelegramAuthState.LOADING);
  const [userData, setUserData] = useState<TelegramUserData>();
  const [error, setError] = useState<TelegramInitDataValidationError | null>(null);

  const validateInitData = useCallback(async (data: string) => {
    setAuthState(TelegramAuthState.VALIDATING);

    try {
      const validatedTelegramUserDataResponse =
          await ApiService.validateTelegramInitData(data);

      if (validatedTelegramUserDataResponse.success && validatedTelegramUserDataResponse.user) {
        setUserData(validatedTelegramUserDataResponse.user);
        setAuthState(TelegramAuthState.SUCCESS);
      } else {
        setAuthState(TelegramAuthState.ERROR);
        setError({
          message: validatedTelegramUserDataResponse.error || 'Ошибка валидации данных',
          details: validatedTelegramUserDataResponse.details || 'Не удалось проверить подлинность данных Telegram'
        });
      }
    } catch (error) {
      setAuthState(TelegramAuthState.ERROR);
      setError({
        message: 'Ошибка валидации initData telegram пользователя',
        details: 'Error: ' + error
      });
    }
  }, []);

  const handleLoginWithTelegram = useCallback(async () => {
    if (!userData) return;

    setAuthState(TelegramAuthState.LOGGING_IN);

    try {
      await loginWithTelegram(userData);
      router.push(PAGE_ROUTES.PROFILE);
    } catch (error) {
      setAuthState(TelegramAuthState.ERROR);
      setError({
        message: 'Ошибка входа в приложение',
        details: 'Не удалось создать сессию пользователя'
      });
    }
  }, [userData, loginWithTelegram, router]);

  useEffect(() => {
    if (isAuthenticated) {
      setAuthState(TelegramAuthState.ALREADY_AUTHENTICATED);
      router.push(PAGE_ROUTES.PROFILE);
      return;
    } else {
      // Логика валидации только если пользователь не авторизован
      const { data: initDataFromHash, error: initDataError } = getInitData();

      if (initDataError) {
        setAuthState(TelegramAuthState.INVALID_ACCESS);
        setError({ message: 'Ошибка доступа к данным авторизации', details: initDataError });
      } else if (!initDataFromHash) {
        setAuthState(TelegramAuthState.NO_DATA);
        setError({ message: 'Не удалось получить данные авторизации из Telegram', details: 'Данные авторизации отсутствуют или повреждены' });
      } else {
        // Обрабатываем Promise и добавляем validateInitData в зависимости
        validateInitData(initDataFromHash).catch(() => {
          setAuthState(TelegramAuthState.ERROR);
          setError({ 
            message: 'Ошибка валидации данных',
            details: 'Произошла непредвиденная ошибка при проверке данных'
          });
        });
      }
    }
  }, [isAuthenticated, validateInitData, router]);

  return {
    authState,
    userData,
    error,
    validateInitData,
    handleLoginWithTelegram
  };
}
