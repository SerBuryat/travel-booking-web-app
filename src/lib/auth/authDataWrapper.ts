import type { TelegramUserInitData } from '@/types/telegram';
import type { UserInfoResult } from '@vkid/sdk';
import type { UserAuthRequest } from '@/lib/auth/types';

const TELEGRAM_AUTH_TYPE = 'telegram';
const VKID_AUTH_TYPE = 'vkid';
const YANDEX_AUTH_TYPE = 'yandex';
const GOOGLE_AUTH_TYPE = 'google';

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

/** Данные пользователя Yandex из GET login.yandex.ru/info */
export interface YandexUserInfo {
  id: string;
  login?: string;
  display_name?: string;
  real_name?: { first_name?: string; last_name?: string };
  default_avatar_id?: string;
  default_email?: string;
  emails?: string[];
}

/**
 * Преобразует ответ Yandex /info в универсальный UserAuthRequest.
 */
export function yandexToUserAuthRequest(userInfo: YandexUserInfo): UserAuthRequest {
  const first = userInfo.real_name?.first_name ?? userInfo.display_name ?? userInfo.login ?? '';
  const last = userInfo.real_name?.last_name;
  const photoUrl = userInfo.default_avatar_id
    ? `https://avatars.yandex.net/get-yapic/${userInfo.default_avatar_id}/islands-200`
    : undefined;
  return {
    auth_type: YANDEX_AUTH_TYPE,
    auth_id: `${YANDEX_AUTH_TYPE}_${userInfo.id}`,
    first_name: first,
    last_name: last,
    photo_url: photoUrl,
    raw_context: userInfo,
  };
}

/** Данные пользователя Google из GET www.googleapis.com/oauth2/v2/userinfo */
export interface GoogleUserInfo {
  id: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  verified_email?: boolean;
}

/**
 * Преобразует ответ Google userinfo в универсальный UserAuthRequest.
 */
export function googleToUserAuthRequest(userInfo: GoogleUserInfo): UserAuthRequest {
  const first = userInfo.given_name ?? userInfo.name ?? '';
  const last = userInfo.family_name;
  return {
    auth_type: GOOGLE_AUTH_TYPE,
    auth_id: `${GOOGLE_AUTH_TYPE}_${userInfo.id}`,
    first_name: first,
    last_name: last,
    photo_url: userInfo.picture,
    raw_context: userInfo,
  };
}
