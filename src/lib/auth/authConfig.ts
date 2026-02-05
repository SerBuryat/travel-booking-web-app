'use server';

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize';

export type VkAuthCreds = {
  appId: number;
  redirectUrl: string;
};

export type AuthUrlResult = {
  url?: string;
  error?: string;
};

export async function getVkAuthCreds(): Promise<VkAuthCreds> {
  const clientId = process.env.VK_APP_ID;
  const callbackUrl = process.env.VK_ID_REDIRECT_URL;

  if (!clientId || !callbackUrl) {
    console.error('[VK Auth] VK_APP_ID или VK_ID_REDIRECT_URL не заданы в .env');
    throw new Error('VK OAuth not configured');
  }

  const appIdNumber = Number(clientId);

  if (!Number.isFinite(appIdNumber) || appIdNumber <= 0) {
    console.error('[VK Auth] VK_APP_ID должен быть положительным числом');
    throw new Error('VK_APP_ID must be a positive number');
  }

  return {
    appId: appIdNumber,
    redirectUrl: callbackUrl,
  };
}

export async function getGoogleAuthUrl(): Promise<AuthUrlResult> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

  if (!clientId || !callbackUrl) {
    console.error('[Google Auth] GOOGLE_CLIENT_ID или GOOGLE_CALLBACK_URL не заданы в .env');
    return { error: 'Google OAuth not configured' };
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'openid email profile',
  });

  const url = `${GOOGLE_AUTHORIZE_URL}?${params.toString()}`;
  return { url };
}

export async function getYandexAuthUrl(): Promise<AuthUrlResult> {
  const clientId = process.env.YANDEX_CLIENT_ID;
  const callbackUrl = process.env.YANDEX_CALLBACK_URL;

  if (!clientId || !callbackUrl) {
    console.error('[Yandex Auth] YANDEX_CLIENT_ID или YANDEX_CALLBACK_URL не заданы в .env');
    return { error: 'Yandex OAuth not configured' };
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
  });

  const url = `${YANDEX_AUTHORIZE_URL}?${params.toString()}`;
  return { url };
}
