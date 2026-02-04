'use server';

const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize';

/**
 * Server Action: возвращает URL для редиректа на страницу авторизации Yandex ID.
 * Секреты берутся из .env на сервере.
 */
export async function getYandexAuthUrl(): Promise<{ url?: string; error?: string }> {
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
