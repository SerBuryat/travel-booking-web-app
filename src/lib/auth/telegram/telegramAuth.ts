'use server';

import { prisma } from '@/lib/db/prisma';
import { generateTokens, setJWTCookieInAction, setRefreshTokenCookieInAction } from '@/lib/auth/authUtils';
import { TelegramUserInitData, TelegramUserData } from '@/types/telegram';
import { validateInitData } from '@/lib/auth/telegram/initData/validateInitData';
import { UserAuth } from '@/lib/auth/getUserAuth';
import {tarea, tclients_auth} from "@prisma/client";
import { SELECTABLE_AREA_TIER } from '@/lib/location/constants';
import {getActiveProviderIdBYClientId} from "@/lib/provider/searchProvider";

/** Тип аутентификации в tclients_auth для входа через Telegram */
const TELEGRAM_AUTH_TYPE = 'telegram';
/** Роль по умолчанию для нового пользователя при первом входе */
const DEFAULT_AUTH_ROLE = 'user';
/** Системное имя области по умолчанию при создании клиента (tarea.sysname) */
const DEFAULT_AREA_SYSNAME = 'Olkhon';
/** Срок жизни записи сессии (tclients_auth.token_expires_at), в миллисекундах. По умолчанию 24 часа */
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // часы · минуты · секунды · мс

/**
 * Аутентификация пользователя через Telegram
 * 
 * @description Валидирует Telegram данные,
 * создает или обновляет пользователя и его аутентификацию в БД,
 * генерирует JWT токены и устанавливает их в cookies.
 * 
 * @param {TelegramUserInitData} telegramUserInitData - Данные пользователя из Telegram
 * @returns {Promise<UserAuth>} Данные аутентифицированного пользователя
 * 
 * @throws {Error} "Telegram validation failed" — если валидация Telegram данных не прошла
 * @throws {Error} "Failed to create or update user" — если не удалось создать/обновить пользователя
 * @throws {Error} "Failed to generate or set auth tokens" — если не удалось установить токены
 */
export async function authWithTelegram(telegramUserInitData: TelegramUserInitData): Promise<UserAuth> {
  // Валидация Telegram данных пользователя при помощи Bot Token и либы telegram-init-data-validator
  const validation = await validateInitData(telegramUserInitData);
  if (!validation.success) {
    throw new Error(`Telegram validation failed: ${validation.error}`);
  }

  // Телеграм данные пользователя по которым будем проходить аутентификацию
  const telegramUserData = telegramUserInitData.user;
  const authAuthId = `${TELEGRAM_AUTH_TYPE}_${telegramUserData.id}`;

  const existsAuth = await prisma.tclients_auth.findFirst({
    where: {
      auth_id: authAuthId,
      auth_type: TELEGRAM_AUTH_TYPE
    }
  });

  const userAuth: UserAuth = existsAuth
      ? await updateExistUser(existsAuth, telegramUserData)
      : await createNewUser(telegramUserData, authAuthId);

  // Работаем с токенами и устанавливаем их в cookies
  const tokens = await generateTokens(userAuth);
  await updateRefreshToken(userAuth.authId, tokens.refreshToken);
  await Promise.all([
    setJWTCookieInAction(tokens.jwtToken),
    setRefreshTokenCookieInAction(tokens.refreshToken)
  ]);

  return userAuth;
}

/**
 * Обновляет существующего пользователя с Telegram данными
 * 
 * @param {tclients_auth} existsAuth - Существующая аутентификация пользователя
 * @param {TelegramUserData} telegramData - Данные пользователя из Telegram
 * @returns {Promise<UserAuth>} Данные аутентифицированного пользователя
 */
export async function updateExistUser(existsAuth: tclients_auth, telegramData: TelegramUserData): Promise<UserAuth> {
  const authData =
      createClientAuthData(existsAuth.auth_id!, TELEGRAM_AUTH_TYPE, existsAuth.role, telegramData);

  const updatedClient = await prisma.tclients.update({
    where: { id: existsAuth.tclients_id },
    data: {
      name: buildFullName(telegramData),
      photo: telegramData.photo_url,
      additional_info: telegramData as any,
      tclients_auth: {
        update: {
          where: { id: existsAuth.id },
          data: {
            auth_context: authData.auth_context,
            token_expires_at: authData.token_expires_at,
            last_login: authData.last_login,
            is_active: authData.is_active,
            role: authData.role
          }
        }
      }
    }
  });

  if(authData.role === 'provider') {
    return await getProviderUserAuth(updatedClient.id, existsAuth.id);
  }

  return {
    userId: updatedClient.id,
    authId: existsAuth.id,
    role: existsAuth.role
  };
}

async function getProviderUserAuth(clientId: number, authId: number) {
  const provider = await getActiveProviderIdBYClientId(clientId);

  if(!provider) {
    console.error(
        '[updateExistUser] Пользователь с ролью `provider` отсутствует в `tproviders`. Переключаем роль на `user`.'
    );

    const switchToClientAuth = await prisma.tclients_auth.update({
      where: {
        id: authId
      },
      data: {
        role: 'user'
      },
      select: {
        id: true
      }
    });

    return {
      userId: clientId,
      authId: switchToClientAuth.id,
      role: 'user'
    };
  }

  return {
    userId: clientId,
    authId: authId,
    role: 'provider',
    providerId: provider.id
  };
}

/**
 * Создает нового пользователя с Telegram данными
 * 
 * @param {TelegramUserData} telegramData - Данные пользователя из Telegram
 * @param {string} authAuthId - ID аутентификации пользователя
 * @returns {Promise<UserAuth>} Данные аутентифицированного пользователя
 */
async function createNewUser(telegramData: TelegramUserData, authAuthId: string): Promise<UserAuth> {
  const authData =
      createClientAuthData(authAuthId, TELEGRAM_AUTH_TYPE, DEFAULT_AUTH_ROLE, telegramData);

  const defaultAreaId = await getDefaultAreaId();

  const createdClient = await prisma.tclients.create({
    data: {
      tarea_id: defaultAreaId,
      name: buildFullName(telegramData),
      photo: telegramData.photo_url,
      additional_info: telegramData as any,
      tclients_auth: {
        create: authData
      }
    },
    include: {
      tclients_auth: true
    }
  });

  const createdAuth = createdClient.tclients_auth.find(auth => auth.auth_type === TELEGRAM_AUTH_TYPE && auth.auth_id === authAuthId);
  if (!createdAuth) {
    throw new Error('Failed to find created auth');
  }

  return {
    userId: createdClient.id,
    authId: createdAuth.id,
    role: authData.role
  };
}

// todo - потом сделаем, чтобы сразу создавался во время создания или обновления юзера
async function updateRefreshToken(authId: number, refreshToken: string) : Promise<boolean> {
  try {
    await prisma.tclients_auth.update({
      where: {
        id: authId,
      },
      data: {
        refresh_token: refreshToken
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating refresh token:', error);
    return false;
  }
}

function buildFullName(telegramData: TelegramUserData): string {
  return telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : '');
}

/**
 * Создает данные для аутентификации пользователя
 *
 * @param {string} authAuthId - tclients_auth.auth_id пользователя
 * @param {string} authType - tclients_auth.auth_type пользователя
 * @param {string} role - tclients_auth.role пользователя
 * @param {TelegramUserData} telegramData - Данные пользователя из Telegram
 * @returns {CreateClientAuthData} Данные для аутентификации пользователя
 */
function createClientAuthData(
    authAuthId: string,
    authType: string,
    role: string,
    telegramData: TelegramUserData
): CreateClientAuthData {
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);
  return {
    auth_type: authType,
    auth_id: authAuthId,
    auth_context: telegramData as any,
    token_expires_at: expiresAt,
    role: role,
    last_login: new Date(),
    is_active: true
  };
}

interface CreateClientAuthData {
  auth_type: string;
  auth_id: string;
  auth_context: any;
  token_expires_at: Date;
  role: string;
  last_login: Date;
  is_active: boolean;
}

/**
 * Возвращает id default area (из константы DEFAULT_AREA_SYSNAME) 
 * и если нет, то первую по tier
 * @throws {Error} Если default area не найдена
 */
async function getDefaultAreaId(): Promise<number> {
  let defaultArea: tarea | null;
  try {
    defaultArea = await prisma.tarea.findFirst({
      where: {
        sysname: DEFAULT_AREA_SYSNAME
      }
    });
  } catch (error) {
    console.error(`Error finding default area: ${DEFAULT_AREA_SYSNAME}. Trying to find first by tier.`, error);
    defaultArea = await prisma.tarea.findFirst({
      where: {
        tier: SELECTABLE_AREA_TIER
      }
    });
  }

  if (!defaultArea) {
    throw new Error('Default area not found');
  }

  return defaultArea.id;
}
