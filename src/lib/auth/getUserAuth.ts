'use server'

import {prisma} from '@/lib/db/prisma';
import {getJWTFromCookies, verifyJWT, getRefreshTokenFromRequest, verifyRefreshToken, generateTokens, setJWTCookieInAction, setRefreshTokenCookieInAction} from '@/lib/auth/authUtils';
import {getActiveProviderIdBYClientId} from '@/lib/provider/searchProvider';

export interface UserAuth {
  userId: number;
  authId: number;
  role: string;
  providerId?: number;
}

/**
 * Возвращает данные аутентифицированного пользователя по JWT из cookies (на сервере).
 *
 * @description Читает JWT из cookies, валидирует его. Если токен истек, пытается обновить его через refresh token.
 * Проверяет наличие пользователя и активной auth-записи и формирует компактную модель `UserAuth`.
 *
 * @returns {Promise<UserAuth>} Данные аутентифицированного пользователя
 *
 * @throws {Error} "JWT is required" — если токен отсутствует
 * @throws {Error} "Invalid JWT" — если токен невалидный или истек и не удалось обновить
 * @throws {Error} "Client auth with auth_id {authId} not found or not active" — если активная auth-запись не найдена
 */
export async function getUserAuthOrThrow(): Promise<UserAuth> {
  const token = await getJWTFromCookies();
  if (!token) {
    throw new Error('JWT is required');
  }

  const jwt = await verifyJWT(token);
  
  // If JWT is expired or invalid, try to refresh it
  if (!jwt) {
    const refreshed = await refreshToken();
    if (!refreshed) {
      throw new Error('Invalid JWT');
    }
    
    // Verify auth is still active after refresh
    const clientAuth = await prisma.tclients_auth.findFirst({
      where: {
        id: refreshed.authId,
        is_active: true
      },
      select: {
        id: true,
        role: true
      }
    });

    if (!clientAuth) {
      throw new Error(`Client auth with auth_id ${refreshed.authId} not found or not active`);
    }

    return { userId: refreshed.userId, authId: refreshed.authId, role: clientAuth.role, providerId: refreshed.providerId };
  }
  
  const {userId, authId, providerId} = jwt;

  const clientAuth = await prisma.tclients_auth.findFirst({
    where: {
      id: jwt.authId,
      is_active: true
    },
    select: {
      id: true,
      role: true
    }
  });

  if (!clientAuth) {
    throw new Error(`Client auth with auth_id ${authId} not found or not active`);
  }

  return { userId, authId, role: clientAuth.role, providerId };
}

/**
 * Возвращает данные аутентифицированного пользователя по JWT из cookies (на сервере).
 *
 * @description Читает JWT из cookies, валидирует его. Если токен истек, пытается обновить его через refresh token.
 * Проверяет наличие пользователя и активной auth-записи и формирует компактную модель `UserAuth`.
 *
 * @returns {Promise<UserAuth | null>} Данные аутентифицированного пользователя или null если не удалось аутентифицировать
 */
export async function getUserAuth(): Promise<UserAuth | null> {
  try {
    return await getUserAuthOrThrow();
  } catch (error) {
    return null;
  }
}

/**
 * Обновляет JWT токен и refresh token используя существующий refresh token из cookies.
 *
 * @description Читает refresh token из cookies, валидирует его, проверяет что он совпадает с тем что в БД,
 * генерирует новые токены, обновляет их в cookies и в БД.
 *
 * @returns {Promise<UserAuth | null>} Данные аутентифицированного пользователя или null если не удалось обновить
 */
async function refreshToken(): Promise<UserAuth | null> {
  try {
    const refreshToken = await getRefreshTokenFromRequest();
    if (!refreshToken) {
      console.info('No refresh token found');
      return null;
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      console.info('Invalid refresh token');
      return null;
    }

    const {userId, authId} = payload;

    // Check that auth exists and refresh token matches
    const clientAuth = await prisma.tclients_auth.findFirst({
      where: {
        id: authId,
        is_active: true
      },
      select: {
        id: true,
        role: true,
        refresh_token: true
      }
    });

    if (!clientAuth || clientAuth.refresh_token !== refreshToken) {
      console.info('Auth not found or refresh token mismatch');
      return null;
    }

    // Check if user has provider role
    const userAuth: UserAuth = { userId, authId, role: clientAuth.role };
    
    // If provider role, get providerId
    if (clientAuth.role === 'provider') {
      const provider = await getActiveProviderIdBYClientId(userId);
      
      if (provider) {
        userAuth.providerId = provider.id;
      }
    }

    // Generate new tokens
    const tokens = await generateTokens(userAuth);

    // Update refresh token in DB and cookies
    // todo - сейчас для `tclients_auth.token_expires_at` проставляется таким образом без `.env` (цель для рефакторинга)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    await prisma.tclients_auth.update({
      where: { id: authId },
      data: { 
        refresh_token: tokens.refreshToken,
        token_expires_at: expiresAt
      }
    });

    await Promise.all([
      setJWTCookieInAction(tokens.jwtToken),
      setRefreshTokenCookieInAction(tokens.refreshToken)
    ]);

    console.info('Tokens refreshed successfully');
    return userAuth;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}