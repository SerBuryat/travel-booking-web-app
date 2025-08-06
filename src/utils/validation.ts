import { TelegramUser } from '@/types/telegram';

/**
 * Валидация Telegram пользователя
 */
export function validateTelegramUser(data: any): TelegramUser | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const { id, first_name, last_name, username, language_code, allows_write_to_pm, photo_url } = data;

  if (!id || typeof id !== 'number') {
    return null;
  }

  if (!first_name || typeof first_name !== 'string') {
    return null;
  }

  return {
    id,
    first_name,
    last_name: last_name || undefined,
    username: username || undefined,
    language_code: language_code || undefined,
    allows_write_to_pm: allows_write_to_pm || false,
    photo_url: photo_url || undefined
  };
}

/**
 * Валидация запроса аутентификации
 */
export function validateAuthRequest(body: any): { telegramUser: any } | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const { telegramUser } = body;

  if (!telegramUser || typeof telegramUser !== 'object') {
    return null;
  }

  return { telegramUser };
} 