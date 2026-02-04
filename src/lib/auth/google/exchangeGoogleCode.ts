'use server';

import { userLogin } from '@/lib/auth/userLogin';
import { googleToUserAuthRequest, type GoogleUserInfo } from '@/lib/auth/authDataWrapper';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

/**
 * Server Action: обмен code на token, запрос данных пользователя Google,
 * создание/обновление пользователя и сессии (JWT). Вызывается со страницы ожидания /login/google/callback.
 */
export async function exchangeGoogleCode(code: string): Promise<{ success: boolean; error?: string }> {
  if (!code || typeof code !== 'string') {
    return { success: false, error: 'code required' };
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

  if (!clientId || !clientSecret) {
    console.error('[Google Auth] Не заданы GOOGLE_CLIENT_ID или GOOGLE_CLIENT_SECRET');
    return { success: false, error: 'config' };
  }

  if (!callbackUrl) {
    console.error('[Google Auth] GOOGLE_CALLBACK_URL не задан (нужен для обмена code на token)');
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
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('[Google Auth] Ошибка обмена code на token:', tokenRes.status, text);
      return { success: false, error: 'token_exchange' };
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[Google Auth] В ответе token нет access_token');
      return { success: false, error: 'token' };
    }

    const userRes = await fetch(GOOGLE_USER_INFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      console.error('[Google Auth] Ошибка запроса userinfo:', userRes.status);
      return { success: false, error: 'user_info' };
    }

    const userInfo = (await userRes.json()) as GoogleUserInfo;

    const userAuthRequest = googleToUserAuthRequest(userInfo);
    await userLogin(userAuthRequest);

    return { success: true };
  } catch (err) {
    console.error('[Google Auth] Исключение в exchangeGoogleCode:', err);
    return { success: false, error: 'server' };
  }
}
