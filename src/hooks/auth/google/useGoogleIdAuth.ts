'use client';

import { getGoogleAuthUrl } from '@/lib/auth/authConfig';

/**
 * Запускает авторизацию через Google.
 * Вызывает Server Action getGoogleAuthUrl(), получает URL страницы входа Google
 * и выполняет редирект. После входа Google редиректит на GOOGLE_CALLBACK_URL
 * (страница ожидания /login/google/callback), где обмениваются code на token
 * и запрашиваются данные пользователя.
 */
export function useGoogleIdAuth(): () => void {
  return async () => {
    const result = await getGoogleAuthUrl();
    if (result.url) {
      window.location.href = result.url;
    } else {
      console.error('[Google Auth]', result.error);
    }
  };
}
