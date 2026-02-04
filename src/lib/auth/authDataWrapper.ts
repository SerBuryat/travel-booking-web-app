import type { TelegramUserInitData } from '@/types/telegram';
import type { UserInfoResult } from '@vkid/sdk';
import type { UserAuthRequest } from '@/lib/auth/types';

const TELEGRAM_AUTH_TYPE = 'telegram';
const VKID_AUTH_TYPE = 'vkid';

/**
 * Преобразует данные пользователя Telegram в универсальный UserAuthRequest.
 * Валидация initData должна быть выполнена вызывающей стороной (например, useTelegramAuthState).
 */
export function telegramToUserAuthRequest(telegramUserInitData: TelegramUserInitData): UserAuthRequest {
  const u = telegramUserInitData.user;
  return {
    auth_type: TELEGRAM_AUTH_TYPE,
    auth_id: `${TELEGRAM_AUTH_TYPE}_${u.id}`,
    first_name: u.first_name,
    last_name: u.last_name,
    photo_url: u.photo_url,
    raw_context: u,
  };
}

/**
 * Преобразует результат VKID Auth.userInfo в универсальный UserAuthRequest.
 */
export function vkidToUserAuthRequest(userInfoResult: UserInfoResult): UserAuthRequest {
  const u = userInfoResult.user;
  const user_id = u?.user_id ?? '';
  return {
    auth_type: VKID_AUTH_TYPE,
    auth_id: `${VKID_AUTH_TYPE}_${user_id}`,
    first_name: u?.first_name ?? '',
    last_name: u?.last_name,
    photo_url: u?.avatar,
    raw_context: u,
  };
}
