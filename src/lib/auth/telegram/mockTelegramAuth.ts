'use server';

import { UserAuth } from '@/lib/auth/getUserAuth';
import { userLogin } from '@/lib/auth/userLogin';
import type { UserAuthRequest } from '@/lib/auth/types';
import type { TelegramUserData } from '@/types/telegram';

const TELEGRAM_AUTH_TYPE = 'telegram';
const TELEGRAM_MOCK_AUTH_ID = 'telegram_878829263';
const MOCK_TELEGRAM_USER_DATA: TelegramUserData = {
  id: 878829263,
  first_name: 'Artem',
  last_name: 'Anosov',
  username: 'ser_buryat',
  photo_url:
    'https://t.me/i/userpic/320/XAwhFXQYWEUlnm-50j7j2p4VV1wEqlQmyTWJvqrXcqg.svg',
};

/**
 * Development-only mock auth for Telegram flow.
 * Собирает UserAuthRequest из фиксированных данных и вызывает userLogin.
 */
export async function mockTelegramAuth(): Promise<UserAuth> {
  if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_MOCK_AUTH !== 'true') {
    throw new Error('mockTelegramAuth is only available in development');
  }

  const userAuthRequest: UserAuthRequest = {
    auth_type: TELEGRAM_AUTH_TYPE,
    auth_id: TELEGRAM_MOCK_AUTH_ID,
    first_name: MOCK_TELEGRAM_USER_DATA.first_name,
    last_name: MOCK_TELEGRAM_USER_DATA.last_name,
    photo_url: MOCK_TELEGRAM_USER_DATA.photo_url,
    raw_context: MOCK_TELEGRAM_USER_DATA,
  };

  return userLogin(userAuthRequest);
}
