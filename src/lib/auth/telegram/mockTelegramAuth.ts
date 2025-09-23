"use server";

import { prisma } from '@/lib/db/prisma';
import { generateTokens, setJWTCookieInAction, setRefreshTokenCookieInAction } from '@/lib/auth/authUtils';
import { UserAuth } from '@/lib/auth/userAuth';
import { AuthRole } from '@/model/ClientType';

const TELEGRAM_AUTH_TYPE = 'telegram';
const TELEGRAM_MOCK_AUTH_ID = 'telegram_878829263';

/**
 * Development-only mock auth for Telegram flow.
 * Loads existing `tclients_auth` by fixed auth_id to bypass real Telegram during local development.
 */
export async function mockTelegramAuth(): Promise<UserAuth> {
  if (process.env.NODE_ENV !== 'development') {
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

  if (!existsAuth.is_active) {
    await prisma.tclients_auth.update({
      where: { id: existsAuth.id },
      data: { is_active: true },
    });
  }

  const userAuth: UserAuth = {
    userId: existsAuth.tclients_id,
    authId: existsAuth.id,
    role: existsAuth.role,
  };

  const tokens = generateTokens(
    userAuth.userId,
    (userAuth.role as AuthRole) || 'user',
    userAuth.authId,
  );

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


