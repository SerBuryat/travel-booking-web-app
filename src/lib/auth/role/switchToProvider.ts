'use server';

import {withUserAuth} from '@/lib/auth/withUserAuth';
import {AuthTokens, generateTokens, setJWTCookieInAction, setRefreshTokenCookieInAction} from '@/lib/auth/authUtils';
import {prisma} from '@/lib/db/prisma';
import {UserAuth} from '@/lib/auth/getUserAuth';
import { getActiveProviderId } from '../../provider/searchProvider';

export interface ProviderSwitchResult {
  success: boolean;
  error?: string;
}

/**
 * Переключает аутентифицированного пользователя на роль провайдера.
 *
 * @description Проверяет наличие пользователя, активного бизнес-аккаунта, обновляет роль
 * в БД и устанавливает новые JWT токены в cookies.
 *
 * @returns {Promise<ProviderSwitchResult | null>} Результат переключения роли
 *
 * @throws {Error} "User not found" — если пользователь не найден
 * @throws {Error} "No active business account found" — если нет активного провайдера
 * @throws {Error} "Active authentication record not found" — если auth запись не найдена
 * @throws {Error} "Failed to update user role" — если не удалось обновить роль
 * @throws {Error} "Failed to generate or set auth tokens" — если не удалось установить токены
 */
export async function switchToProvider(): Promise<ProviderSwitchResult | null> {
  return withUserAuth(async ({ userAuth }) => {
    if (userAuth.role === 'provider') {
      return {
        success: false,
        error: 'User is already a provider'
      };
    }

    try {
      await updateUserRole(userAuth, 'provider');
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to switch to provider with error: ' + error
      };
    }
  });
}

/**
 * Обновляет роль пользователя в БД и устанавливает новые JWT токены.
 *
 * @description Выполняет полный цикл обновления роли: проверка пользователя,
 * проверка бизнес-аккаунта (для роли provider), обновление роли в БД,
 * генерация и установка новых токенов.
 *
 * @param {UserAuth} userAuth - Данные аутентифицированного пользователя
 * @param {string} role - Новая роль пользователя
 *
 * @throws {Error} "User not found" — если пользователь не найден
 * @throws {Error} "No active business account found" — если нет активного провайдера
 * @throws {Error} "Active authentication record not found" — если auth запись не найдена
 * @throws {Error} "Failed to update user role" — если не удалось обновить роль
 * @throws {Error} "Failed to generate or set auth tokens" — если не удалось установить токены
 */
async function updateUserRole(userAuth: UserAuth, role: string) : Promise<void> {
  const userExists = await existsByClientId(userAuth.userId);
  if (!userExists) {
    throw new Error('User not found');
  }

  if (role === 'provider') {
    const activeProviderId = await getActiveProviderId(userAuth.userId);
    if (!activeProviderId) {
      throw new Error('No active business account found. Please register a service first.');
    }
    userAuth.providerId = activeProviderId.id;
  }

  const clientAuth = await getClientAuthById(userAuth.authId);
  if (!clientAuth) {
    throw new Error('Active authentication record not found');
  }

  const updatedAuth = await updateClientAuthRole(userAuth.authId, role);
  if (!updatedAuth) {
    throw new Error('Failed to update user role');
  }

  const tokens = await updateJwt(userAuth);
  if (!tokens) {
    throw new Error('Failed to generate or set auth tokens');
  }
}

async function existsByClientId(clientId: number): Promise<boolean> {
  const client = await prisma.tclients.findUnique({
    where: { id: clientId },
    select: { id: true }
  });
  return !!client;
}

async function getClientAuthById(authId: number) {
  return prisma.tclients_auth.findUnique({
    where: {
      id: authId,
      is_active: true
    },
    select: {
      id: true,
      role: true
    }
  });
}

async function updateClientAuthRole(authId: number, newRole: string) {
  return prisma.tclients_auth.update({
    where: {
      id: authId,
      is_active: true
    },
    data: {
      role: newRole
    }
  });
}

/**
 * Генерирует и устанавливает новые JWT токены в cookies.
 *
 * @returns {Promise<AuthTokens | null>} Сгенерированные токены или null при ошибке
 * @param userAuth
 */
async function updateJwt(userAuth: UserAuth)
    : Promise<AuthTokens | null> {
  try {
    const tokens = await generateTokens(userAuth);

    await Promise.all([
      setJWTCookieInAction(tokens.jwtToken),
      setRefreshTokenCookieInAction(tokens.refreshToken)
    ]);

    return tokens;
  } catch (error) {
    console.error('Failed to update JWT:', error);
    return null;
  }
}
