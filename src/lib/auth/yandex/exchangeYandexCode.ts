'use server';

import { userLogin } from '@/lib/auth/userLogin';
import { yandexToUserAuthRequest, type YandexUserInfo } from '@/lib/auth/authDataWrapper';

const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token';
const YANDEX_USER_INFO_URL = 'https://login.yandex.ru/info?format=json';

/**
 * Server Action: обмен code на token, запрос данных пользователя Yandex,
 * создание/обновление пользователя и сессии (JWT). Вызывается со страницы ожидания /login/yandex/callback.
 */
export async function exchangeYandexCode(code: string): Promise<{ success: boolean; error?: string }> {
  if (!code || typeof code !== 'string') {
    return { success: false, error: 'code required' };
  }

  const clientId = process.env.YANDEX_CLIENT_ID;
  const clientSecret = process.env.YANDEX_CLIENT_SECRET;
  const callbackUrl = process.env.YANDEX_CALLBACK_URL;

  if (!clientId || !clientSecret) {
    console.error('[Yandex Auth] Не заданы YANDEX_CLIENT_ID или YANDEX_CLIENT_SECRET');
    return { success: false, error: 'config' };
  }

  if (!callbackUrl) {
    console.error('[Yandex Auth] YANDEX_CALLBACK_URL не задан (нужен для обмена code на token)');
    return { success: false, error: 'config' };
  }

  try {
    const tokenParams: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
    };
    const tokenRes = await fetch(YANDEX_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('[Yandex Auth] Ошибка обмена code на token:', tokenRes.status, text);
      return { success: false, error: 'token_exchange' };
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[Yandex Auth] В ответе token нет access_token');
      return { success: false, error: 'token' };
    }

    const userRes = await fetch(YANDEX_USER_INFO_URL, {
      headers: { Authorization: `Oauth ${accessToken}` },
    });

    if (!userRes.ok) {
      console.error('[Yandex Auth] Ошибка запроса /info:', userRes.status);
      return { success: false, error: 'user_info' };
    }

    const userInfo = (await userRes.json()) as YandexUserInfo;

    const userAuthRequest = yandexToUserAuthRequest(userInfo);
    await userLogin(userAuthRequest);

    return { success: true };
  } catch (err) {
    console.error('[Yandex Auth] Исключение в exchangeYandexCode:', err);
    return { success: false, error: 'server' };
  }
}
