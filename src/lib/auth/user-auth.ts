import {prisma} from '@/lib/db/prisma';
import {getJWTFromCookies, verifyJWT} from '@/lib/auth/auth-utils';

export interface UserAuth {
  userId: number;
  authId: string;
  role: string;
  providerId?: number;
}

export class UserAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserAuthError';
  }
}

/**
 * Возвращает данные аутентифицированного пользователя по JWT из cookies (на сервере).
 *
 * @description Читает JWT из cookies, валидирует его, проверяет наличие пользователя и активной auth-записи
 * и формирует компактную модель `UserAuth`.
 *
 * @returns {Promise<UserAuth>} Данные аутентифицированного пользователя
 *
 * @throws {UserAuthError} "JWT is required" — если токен отсутствует
 * @throws {UserAuthError} "Invalid JWT" — если токен невалидный или истек
 * @throws {Error} "Client with id {id} not found" — если пользователь не найден
 * @throws {Error} "Client auth with auth_id {authId} not found" — если активная auth-запись не найдена
 */
export async function getUserAuthOrThrow(): Promise<UserAuth> {
  const token = await getJWTFromCookies();
  if (!token) {
    throw new UserAuthError('JWT is required');
  }

  const jwtPayload = verifyJWT(token);
  if (!jwtPayload) {
    throw new UserAuthError('Invalid JWT');
  }

  const userId = await getClientIdById(jwtPayload.userId);

  const { authId, role } = await getClientAuthIdAndRoleByAuthId(jwtPayload.authId);

  const providerId = await getProviderIdByClientIdOptional(jwtPayload.userId);

  return { userId, authId, role, providerId };
}

async function getClientIdById(clientId: number): Promise<number> {
  const client = await prisma.tclients.findUnique({
    where: { id: clientId },
    select: { id: true }
  });

  if (!client) {
    throw new Error(`Client with id ${clientId} not found`);
  }

  return client.id;
}

async function getClientAuthIdAndRoleByAuthId(authId: string): Promise<{ authId: string; role: string }> {
  const clientAuth = await prisma.tclients_auth.findFirst({
    where: {
      auth_id: authId,
      is_active: true
    },
    select: {
      auth_id: true,
      role: true
    }
  });

  if (!clientAuth) {
    throw new Error(`Client auth with auth_id ${authId} not found`);
  }

  return {
    authId: clientAuth.auth_id!,
    role: clientAuth.role
  };
}

async function getProviderIdByClientIdOptional(clientId: number): Promise<number | undefined> {
  const provider = await prisma.tproviders.findFirst({
    where: {
      tclients_id: clientId,
      status: 'active'
    },
    select: {
      id: true
    }
  });

  return provider?.id;
}