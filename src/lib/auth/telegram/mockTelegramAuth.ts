"use server";

import { prisma } from '@/lib/db/prisma';
import { generateTokens, setJWTCookieInAction, setRefreshTokenCookieInAction } from '@/lib/auth/authUtils';
import { UserAuth } from '@/lib/auth/getUserAuth';
import { AuthRole } from '@/model/ClientType';
import { updateExistUser } from './telegramAuth';
import {TelegramUserData} from "@/types/telegram";

const TELEGRAM_AUTH_TYPE = 'telegram';
const TELEGRAM_MOCK_AUTH_ID = 'telegram_878829263';
const MOCK_TELEGRAM_USER_DATA: TelegramUserData = {
  id: 878829263,
  first_name: 'Artem',
  last_name: 'Anosov',
  username: 'ser_buryat',
  photo_url: 'https://t.me/i/userpic/320/XAwhFXQYWEUlnm-50j7j2p4VV1wEqlQmyTWJvqrXcqg.svg'
}

/**
 * Development-only mock auth for Telegram flow.
 * Loads existing `tclients_auth` by fixed auth_id to bypass real Telegram during local development.
 */
export async function mockTelegramAuth(): Promise<UserAuth> {
  if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_MOCK_AUTH !== 'true') {
    throw new Error('mockTelegramAuth is only available in development');
  }

  const existsAuth = await prisma.tclients_auth.findFirst({
    where: {
      auth_id: TELEGRAM_MOCK_AUTH_ID,
      auth_type: TELEGRAM_AUTH_TYPE,
    },
  });

  if (!existsAuth) {
    throw new Error(`Mock auth record not found for auth_id=${TELEGRAM_MOCK_AUTH_ID}`);
  }

  const userAuth = await updateExistUser(existsAuth, MOCK_TELEGRAM_USER_DATA);

  const tokens = await generateTokens(userAuth);

  await updateRefreshToken(userAuth.authId, tokens.refreshToken);
  await Promise.all([
    setJWTCookieInAction(tokens.jwtToken),
    setRefreshTokenCookieInAction(tokens.refreshToken),
  ]);

  return userAuth;
}

async function updateRefreshToken(authId: number, refreshToken: string): Promise<boolean> {
  try {
    await prisma.tclients_auth.update({
      where: { id: authId },
      data: { refresh_token: refreshToken },
    });
    return true;
  } catch (error) {
    console.error('Error updating refresh token (mockTelegramAuth):', error);
    return false;
  }
}


