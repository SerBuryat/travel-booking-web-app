import {cookies} from 'next/headers';
import jwt, {Secret} from 'jsonwebtoken';
import type {StringValue} from 'ms';
import type {JWTPayload, RefreshTokenPayload} from '@/types/jwt';
import {UserAuth} from "@/lib/auth/getUserAuth";

// Cookies
const JWT_COOKIE_NAME = 'auth_token';
// default = 1 day
const JWT_COOKIE_TTL = Number(process.env.COOKIE_JWT_TTL) || 86400;

const REFRESH_COOKIE_NAME = 'refresh_token';
// default = 1 week
const REFRESH_JWT_COOKIE_TTL = Number(process.env.COOKIE_REFRESH_JWT_TTL) || 604800;

export async function getJWTFromCookies(): Promise<string | null> {
  return await cookies()
    .then(cookieStore => cookieStore.get(JWT_COOKIE_NAME)?.value || null)
    .catch(() => {
      console.info('Error getting JWT from cookies');
      return null;
    });
}

export async function getRefreshTokenFromRequest(): Promise<string> | null {
  const c = await cookies();
  return c.get(REFRESH_COOKIE_NAME)?.value || null;
}

// Server Actions cookie setters
export async function setJWTCookieInAction(token: string): Promise<void> {
  const c = await cookies();
  c.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: JWT_COOKIE_TTL,
    path: '/',
  });
}

export async function setRefreshTokenCookieInAction(token: string): Promise<void> {
  const c = await cookies();
  c.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_JWT_COOKIE_TTL,
    path: '/',
  });
}

export async function clearAuthCookies(): Promise<void> {
  const c = await cookies();
  c.delete(JWT_COOKIE_NAME);
  c.delete(REFRESH_COOKIE_NAME);
}

// JWT
const JWT_SECRET: Secret = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: StringValue = process.env.JWT_EXPIRES_IN as StringValue || '1d';
const REFRESH_TOKEN_EXPIRES_IN: StringValue = process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue || '14d';

// todo - все `Promise.resolve()` ниже, ради использования в 'use server'
//  но пока непонятно, нужны они в таком виде или нет (цель для рефакторинга)

export async function verifyJWT(token: string): Promise<JWTPayload> | null {
  try {
    return Promise.resolve(jwt.verify(token, JWT_SECRET) as JWTPayload);
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> | null {
  try {
    return Promise.resolve(jwt.verify(token, JWT_SECRET) as RefreshTokenPayload);
  } catch (error) {
    console.error('Refresh token verification error:', error);
    return null;
  }
}

export interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
}

/**
 * Генерация JWT токенов
 */
export async function generateTokens(userAuth: UserAuth): Promise<AuthTokens> {
  return Promise.resolve(
      {
        jwtToken: generateJWT(userAuth),
        refreshToken: generateRefreshToken(userAuth.userId, userAuth.authId)
      }
  );
}

function generateJWT(userAuth: UserAuth): string {
  const {userId, authId, role, providerId} = userAuth;

  const payload: JWTPayload = {
    userId, role, authId, ...(providerId && { providerId }),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function generateRefreshToken(userId: number, authId: number): string {
  const tokenId = generateRandomBytes(16);
  const payload: RefreshTokenPayload = { userId, authId, tokenId };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

function generateRandomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}


