import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {TelegramUserData, TelegramUserInitData} from '@/types/telegram';
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

export interface TelegramAuthValidationError {
  message: string;
  details?: string;
}

export function useTelegramAuthState() {
  const router = useRouter();

  const { loginWithTelegram, isAuthenticated } = useAuth();

  const [authState, setAuthState] = useState<TelegramAuthState>(TelegramAuthState.LOADING);
  const [userData, setUserData] = useState<TelegramUserData>();
  const [error, setError] = useState<TelegramAuthValidationError | null>(null);

  const validateInitData = useCallback(async (telegramUserInitData: TelegramUserInitData) => {
    setAuthState(TelegramAuthState.VALIDATING);

    try {
      const telegramUserDataValidation =
          await ApiService.validateTelegramInitData(telegramUserInitData.initData);

      if (telegramUserDataValidation.success) {
        setUserData(telegramUserInitData.user);
        setAuthState(TelegramAuthState.SUCCESS);
      } else {
        setAuthState(TelegramAuthState.ERROR);
        setError({
          message: telegramUserDataValidation.error || 'Ошибка валидации данных',
          details: telegramUserDataValidation.details || 'Не удалось проверить подлинность данных Telegram'
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
      try {
        const hash = window.location.hash;
        const telegramUserInitData = getInitData(hash);

        validateInitData(telegramUserInitData).catch(() => {
          setAuthState(TelegramAuthState.ERROR);
          setError({
            message: 'Ошибка валидации данных',
            details: 'Произошла ошибка при валидации telegram `initData` пользователя'
          });
        });
      } catch (err) {
        setAuthState(TelegramAuthState.NO_DATA);
        setError({
          message: 'Не удалось получить данные авторизации из Telegram',
          details: 'Данные авторизации отсутствуют или повреждены'
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
