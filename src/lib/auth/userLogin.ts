'use server';

import { prisma } from '@/lib/db/prisma';
import {
  generateTokens,
  setJWTCookieInAction,
  setRefreshTokenCookieInAction,
} from '@/lib/auth/authUtils';
import { UserAuth } from '@/lib/auth/getUserAuth';
import type { UserAuthRequest } from '@/lib/auth/types';
import { tarea, tclients_auth } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { SELECTABLE_AREA_TIER } from '@/lib/location/constants';
import { getActiveProviderIdBYClientId } from '@/lib/provider/searchProvider';

/** Роль по умолчанию для нового пользователя при первом входе */
const DEFAULT_AUTH_ROLE = 'user';
/** Системное имя области по умолчанию при создании клиента (tarea.sysname) */
const DEFAULT_AREA_SYSNAME = 'Olkhon';
/** Срок жизни записи сессии (tclients_auth.token_expires_at), в миллисекундах. По умолчанию 24 часа */
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

interface CreateClientAuthData {
  auth_type: string;
  auth_id: string;
  auth_context: unknown;
  token_expires_at: Date;
  role: string;
  last_login: Date;
  is_active: boolean;
}

/**
 * Универсальный вход: создание/обновление пользователя в tclients и tclients_auth,
 * генерация JWT и установка cookies.
 *
 * @param userAuthRequest — универсальный запрос от провайдера (Telegram, VK ID и т.д.)
 * @returns данные аутентифицированного пользователя
 */
export async function userLogin(userAuthRequest: UserAuthRequest): Promise<UserAuth> {
  const { auth_type, auth_id } = userAuthRequest;

  const existsAuth = await prisma.tclients_auth.findFirst({
    where: {
      auth_id,
      auth_type,
    },
  });

  const userAuth: UserAuth = existsAuth
    ? await updateExistUser(existsAuth, userAuthRequest)
    : await createNewUser(userAuthRequest);

  const tokens = await generateTokens(userAuth);
  await updateRefreshToken(userAuth.authId, tokens.refreshToken);
  await Promise.all([
    setJWTCookieInAction(tokens.jwtToken),
    setRefreshTokenCookieInAction(tokens.refreshToken),
  ]);

  return userAuth;
}

async function updateExistUser(
  existsAuth: tclients_auth,
  request: UserAuthRequest
): Promise<UserAuth> {
  const authData = createClientAuthData(
    existsAuth.auth_id!,
    request.auth_type,
    existsAuth.role,
    request
  );

  const updatedClient = await prisma.tclients.update({
    where: { id: existsAuth.tclients_id },
    data: {
      name: buildFullName(request),
      photo: request.photo_url ?? null,
      additional_info: (request.raw_context ?? null) as Prisma.InputJsonValue,
      tclients_auth: {
        update: {
          where: { id: existsAuth.id },
          data: {
            auth_context: (authData.auth_context ?? null) as Prisma.InputJsonValue,
            token_expires_at: authData.token_expires_at,
            last_login: authData.last_login,
            is_active: authData.is_active,
            role: authData.role,
          },
        },
      },
    },
  });

  if (authData.role === 'provider') {
    return await getProviderUserAuth(updatedClient.id, existsAuth.id);
  }

  return {
    userId: updatedClient.id,
    authId: existsAuth.id,
    role: existsAuth.role,
  };
}

async function getProviderUserAuth(clientId: number, authId: number): Promise<UserAuth> {
  const provider = await getActiveProviderIdBYClientId(clientId);

  if (!provider) {
    console.error(
      '[userLogin] Пользователь с ролью `provider` отсутствует в `tproviders`. Переключаем роль на `user`.'
    );
    const switchToClientAuth = await prisma.tclients_auth.update({
      where: { id: authId },
      data: { role: 'user' },
      select: { id: true },
    });
    return {
      userId: clientId,
      authId: switchToClientAuth.id,
      role: 'user',
    };
  }

  return {
    userId: clientId,
    authId: authId,
    role: 'provider',
    providerId: provider.id,
  };
}

async function createNewUser(request: UserAuthRequest): Promise<UserAuth> {
  const authData = createClientAuthData(
    request.auth_id,
    request.auth_type,
    DEFAULT_AUTH_ROLE,
    request
  );

  const defaultAreaId = await getDefaultAreaId();

  await prisma.tclients.create({
    data: {
      tarea_id: defaultAreaId,
      name: buildFullName(request),
      photo: request.photo_url ?? null,
      additional_info: (request.raw_context ?? null) as Prisma.InputJsonValue,
      tclients_auth: {
        create: {
          auth_type: authData.auth_type,
          auth_id: authData.auth_id,
          auth_context: (authData.auth_context ?? null) as Prisma.InputJsonValue,
          token_expires_at: authData.token_expires_at,
          role: authData.role,
          last_login: authData.last_login,
          is_active: authData.is_active,
        },
      },
    },
  });

  const createdAuth = await prisma.tclients_auth.findFirst({
    where: {
      auth_id: request.auth_id,
      auth_type: request.auth_type,
    },
  });
  if (!createdAuth) {
    throw new Error('Failed to find created auth');
  }

  return {
    userId: createdAuth.tclients_id,
    authId: createdAuth.id,
    role: authData.role,
  };
}

async function updateRefreshToken(authId: number, refreshToken: string): Promise<boolean> {
  try {
    await prisma.tclients_auth.update({
      where: { id: authId },
      data: { refresh_token: refreshToken },
    });
    return true;
  } catch (error) {
    console.error('Error updating refresh token:', error);
    return false;
  }
}

function buildFullName(request: UserAuthRequest): string {
  return request.first_name + (request.last_name ? ` ${request.last_name}` : '');
}

function createClientAuthData(
  authAuthId: string,
  authType: string,
  role: string,
  request: UserAuthRequest
): CreateClientAuthData {
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);
  return {
    auth_type: authType,
    auth_id: authAuthId,
    auth_context: request.raw_context ?? null,
    token_expires_at: expiresAt,
    role,
    last_login: new Date(),
    is_active: true,
  };
}

async function getDefaultAreaId(): Promise<number> {
  let defaultArea: tarea | null;
  try {
    defaultArea = await prisma.tarea.findFirst({
      where: { sysname: DEFAULT_AREA_SYSNAME },
    });
  } catch (error) {
    console.error(
      `Error finding default area: ${DEFAULT_AREA_SYSNAME}. Trying to find first by tier.`,
      error
    );
    defaultArea = await prisma.tarea.findFirst({
      where: { tier: SELECTABLE_AREA_TIER },
    });
  }

  if (!defaultArea) {
    throw new Error('Default area not found');
  }

  return defaultArea.id;
}
