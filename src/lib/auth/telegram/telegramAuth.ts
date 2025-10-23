'use server';

import { prisma } from '@/lib/db/prisma';
import { generateTokens, setJWTCookieInAction, setRefreshTokenCookieInAction } from '@/lib/auth/authUtils';
import { TelegramUserInitData, TelegramUserData } from '@/types/telegram';
import { TelegramService } from '@/service/TelegramService';
import { UserAuth } from '@/lib/auth/userAuth';
import { AuthRole } from '@/model/ClientType';
import {tarea, tclients_auth} from "@prisma/client";
import { SELECTABLE_AREA_TIER } from '@/lib/location/constants';

const TELEGRAM_AUTH_TYPE = 'telegram';
const AUTH_ROLE = 'user';
const DEFAULT_AREA_SYSNAME = 'Olkhon';

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
  const validation = TelegramService.validateTelegramInitData(telegramUserInitData);
  if (!validation.success) {
    throw new Error(`Telegram validation failed: ${validation.error}`);
  }

  // Телеграм данные пользователя по которым будем проходить аутентификацию
  const telegramUserData = telegramUserInitData.user;
  const authAuthId = `${TELEGRAM_AUTH_TYPE}_${telegramUserData.id}`;

  // Проверяем, существует ли пользователь с таким auth_id и auth_type
  const existsAuth = await prisma.tclients_auth.findFirst({
    where: {
      auth_id: authAuthId,
      auth_type: TELEGRAM_AUTH_TYPE
    }
  });

  // Если пользователь существует, обновляем его, иначе создаем нового и возврашаем данные аутентифицированного пользователя
  let userAuth: UserAuth;
  if (existsAuth) {
    userAuth = await updateExistUser(existsAuth, telegramUserData);
  } else {
    userAuth = await createNewUser(telegramUserData, authAuthId);
  }

  // Работаем с токенами и устанавливаем их в cookies
  const tokens = generateTokens(userAuth.userId, (userAuth.role as AuthRole) || AUTH_ROLE, userAuth.authId);
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
async function updateExistUser(existsAuth: tclients_auth, telegramData: TelegramUserData): Promise<UserAuth> {
  const authData = createClientAuthData(existsAuth.auth_id!, TELEGRAM_AUTH_TYPE, telegramData);

  const result = await prisma.tclients.update({
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

  return {
    userId: result.id,
    authId: existsAuth.id,
    role: existsAuth.role
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
  const authData = createClientAuthData(authAuthId, TELEGRAM_AUTH_TYPE, telegramData);

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
 * @param {string} authAuthId - auth_id пользователя
 * @param {string} authType - auth_type пользователя
 * @param {TelegramUserData} telegramData - Данные пользователя из Telegram
 * @returns {Object} Данные для аутентификации пользователя
 */
function createClientAuthData(
    authAuthId: string,
    authType: string,
    telegramData: TelegramUserData
): CreateClientAuthData {
  // todo - должна быть централизованная установка время истечения токена, т.к. в authUtils.ts есть константа
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);
  return {
    auth_type: authType,
    auth_id: authAuthId,
    auth_context: telegramData as any,
    token_expires_at: expiresAt,
    role: AUTH_ROLE,
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
  let defaultArea: tarea | null = null;
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
