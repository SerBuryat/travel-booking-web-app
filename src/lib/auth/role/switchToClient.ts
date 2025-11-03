'use server';

import {withUserAuth} from '@/lib/auth/withUserAuth';
import {AuthTokens, generateTokens, setJWTCookieInAction, setRefreshTokenCookieInAction} from '@/lib/auth/authUtils';
import {prisma} from '@/lib/db/prisma';
import {UserAuth} from '@/lib/auth/getUserAuth';

export interface ClientSwitchResult {
  success: boolean;
  error?: string;
}

/**
 * Переключает аутентифицированного пользователя обратно на роль клиента.
 *
 * @description Проверяет наличие пользователя, обновляет роль в БД и
 * переустанавливает JWT токены без контекста провайдера.
 */
export async function switchToClient(): Promise<ClientSwitchResult | null> {
  return withUserAuth(async ({ userAuth }) => {
    if (userAuth.role === 'user') {
      return {
        success: false,
        error: 'User is already a client'
      };
    }

    try {
      await updateUserRole(userAuth, 'user');
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to switch to client with error: ' + error
      };
    }
  });
}

async function updateUserRole(userAuth: UserAuth, role: string) : Promise<void> {
  const userExists = await existsByClientId(userAuth.userId);
  if (!userExists) {
    throw new Error('User not found');
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

  if (role === 'user') {
    userAuth.providerId = undefined;
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

async function updateJwt(userAuth: UserAuth) : Promise<AuthTokens | null> {
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


