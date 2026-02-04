'use server';

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

/**
 * Server Action: возвращает URL для редиректа на страницу авторизации Google.
 * Секреты берутся из .env на сервере.
 */
export async function getGoogleAuthUrl(): Promise<{ url?: string; error?: string }> {
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
