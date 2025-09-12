import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import jwt, {Secret} from 'jsonwebtoken';
import type {StringValue} from 'ms';
import type {JWTPayload, RefreshTokenPayload} from '@/types/jwt';

// Cookies
export const JWT_COOKIE_NAME = 'auth_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';

export async function getJWTFromCookies(): Promise<string | null> {
  return await cookies()
    .then(cookieStore => cookieStore.get(JWT_COOKIE_NAME)?.value || null)
    .catch(() => {
      console.info('Error getting JWT from cookies');
      return null;
    });
}

export function getRefreshTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(REFRESH_COOKIE_NAME)?.value || null;
}

export function setJWTCookie(token: string, response: NextResponse): NextResponse {
  response.cookies.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  });
  return response;
}

export function setRefreshTokenCookie(token: string, response: NextResponse): NextResponse {
  response.cookies.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  return response;
}

// Server Actions cookie setters (no NextResponse context)
export async function setJWTCookieInAction(token: string): Promise<void> {
  const c = await cookies();
  c.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  });
}

export async function setRefreshTokenCookieInAction(token: string): Promise<void> {
  const c = await cookies();
  c.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(JWT_COOKIE_NAME);
  response.cookies.delete(REFRESH_COOKIE_NAME);
  return response;
}

// JWT
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: StringValue = '1d';
const REFRESH_TOKEN_EXPIRES_IN: StringValue = '14d';

function generateRandomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generateJWT(userId: number, role: string, authId: number, providerId?: number): string {
  const payload: JWTPayload = {
    userId, role, authId, ...(providerId && { providerId }),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(userId: number, authId: number): string {
  const tokenId = generateRandomBytes(16);
  const payload: RefreshTokenPayload = { userId, authId, tokenId };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
  } catch (error) {
    console.error('Refresh token verification error:', error);
    return null;
  }
}

export interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
  expiresAt: Date;
}

/**
 * Генерация JWT токенов
 */
export function generateTokens(userId: number, role: string, authId: number, providerId?: number): AuthTokens {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  return {
    jwtToken: generateJWT(userId, role, authId, providerId),
    refreshToken: generateRefreshToken(userId, authId),
    expiresAt
  };
}


