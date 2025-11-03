'use server'

import {prisma} from '@/lib/db/prisma';
import {getJWTFromCookies, verifyJWT} from '@/lib/auth/authUtils';

export interface UserAuth {
  userId: number;
  authId: number;
  role: string;
  providerId?: number;
}

/**
 * Возвращает данные аутентифицированного пользователя по JWT из cookies (на сервере).
 *
 * @description Читает JWT из cookies, валидирует его, проверяет наличие пользователя и активной auth-записи
 * и формирует компактную модель `UserAuth`.
 *
 * @returns {Promise<UserAuth>} Данные аутентифицированного пользователя
 *
 * @throws {Error} "JWT is required" — если токен отсутствует
 * @throws {Error} "Invalid JWT" — если токен невалидный или истек
 * @throws {Error} "Client auth with auth_id {authId} not found or not active" — если активная auth-запись не найдена
 */
export async function getUserAuthOrThrow(): Promise<UserAuth> {
  const token = await getJWTFromCookies();
  if (!token) {
    throw new Error('JWT is required');
  }

  const jwt = await verifyJWT(token);
  if (!jwt) {
    throw new Error('Invalid JWT');
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