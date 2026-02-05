'use client';

import { getYandexAuthUrl } from '@/lib/auth/authConfig';

/**
 * Запускает авторизацию через Yandex ID.
 * Вызывает Server Action getYandexAuthUrl(), получает URL страницы входа Yandex
 * и выполняет редирект. После входа Yandex редиректит на YANDEX_CALLBACK_URL
 * (страница ожидания /login/yandex/callback), где обмениваются code на token
 * и запрашиваются данные пользователя.
 */
export function useYandexIdAuth(): () => void {
  return async () => {
    const result = await getYandexAuthUrl();
    if (result.url) {
      window.location.href = result.url;
    } else {
      console.error('[Yandex Auth]', result.error);
    }
  };
}
