import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {TelegramUserInitData} from '@/types/telegram';
import {getInitData} from '@/lib/telegram/telegramInitData';
import {useAuth} from '@/contexts/AuthContext';
import {PAGE_ROUTES} from '@/utils/routes';
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

  const { loginViaTelegram, isAuthenticated } = useAuth();

  const [authState, setAuthState] = useState<TelegramAuthState>(TelegramAuthState.LOADING);
  const [userData, setUserData] = useState<TelegramUserInitData>();
  const [error, setError] = useState<TelegramAuthValidationError | null>(null);

  const validateTelegramUserInitData = useCallback(async (telegramUserInitData: TelegramUserInitData) => {
    setAuthState(TelegramAuthState.VALIDATING);

    try {
      const telegramUserDataValidation =
          await ApiService.validateTelegramInitData(telegramUserInitData);

      if (telegramUserDataValidation.success) {
        setUserData(telegramUserInitData);
        setAuthState(TelegramAuthState.SUCCESS);
      } else {
        setAuthState(TelegramAuthState.ERROR);
        setError({
          message: telegramUserDataValidation.error || 'Ошибка валидации данных',
          details: telegramUserDataValidation.details || 'Не удалось проверить подлинность данных Telegram'
        });
      }
    } catch (ex) {
      setAuthState(TelegramAuthState.ERROR);
      setError({
        message: 'Ошибка валидации initData telegram пользователя',
        details: 'Error: ' + ex
      });
    }
  }, []);

  const handleLoginWithTelegramUserInitData = useCallback(async () => {
    if (!userData) {
      setAuthState(TelegramAuthState.NO_DATA);
      setError({
        message: 'По какой-то причине не удалось получить данные авторизации из Telegram',
        details: 'Данные авторизации отсутствуют или повреждены, либо произошла ошибка при валидации данных'
      });
      return;
    }

    setAuthState(TelegramAuthState.LOGGING_IN);

    try {
      await loginViaTelegram(userData);
      router.push(PAGE_ROUTES.PROFILE);
    } catch (error) {
      setAuthState(TelegramAuthState.ERROR);
      setError({
        message: 'Ошибка входа в приложение через телеграм',
        details: `Не удалось создать сессию пользователя. ${error}`
      });
    }
  }, [userData, loginViaTelegram, router]);

  useEffect(() => {
    if (isAuthenticated) {
      setAuthState(TelegramAuthState.ALREADY_AUTHENTICATED);
      router.push(PAGE_ROUTES.PROFILE);
    } else {
      try {
        const hash = window.location.hash;
        const telegramUserInitData = getInitData(hash);

        validateTelegramUserInitData(telegramUserInitData).catch(() => {
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
  }, [isAuthenticated, validateTelegramUserInitData, router]);

  return {authState, userData, error, handleLoginWithTelegramUserInitData};
}
