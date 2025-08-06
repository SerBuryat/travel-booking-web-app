import { NextRequest, NextResponse } from 'next/server';

// Константы для cookies
const JWT_COOKIE_NAME = 'auth_token';
const REFRESH_COOKIE_NAME = 'refresh_token';

/**
 * Получает JWT токен из cookies (для middleware)
 */
export function getJWTFromRequest(request: NextRequest): string | null {
  return request.cookies.get(JWT_COOKIE_NAME)?.value || null;
}

/**
 * Получает refresh токен из cookies (для middleware)
 */
export function getRefreshTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(REFRESH_COOKIE_NAME)?.value || null;
}

/**
 * Устанавливает JWT токен в cookies
 */
export function setJWTCookie(token: string, response: NextResponse): NextResponse {
  response.cookies.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 час
    path: '/',
  });
  return response;
}

/**
 * Устанавливает refresh токен в cookies
 */
export function setRefreshTokenCookie(token: string, response: NextResponse): NextResponse {
  response.cookies.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 дней
    path: '/',
  });
  return response;
}

/**
 * Удаляет токены из cookies
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(JWT_COOKIE_NAME);
  response.cookies.delete(REFRESH_COOKIE_NAME);
  return response;
}

/**
 * Логирует попытки входа
 */
export function logLoginAttempt(userId: number, success: boolean, ip?: string): void {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'FAILED';
  
  console.log(`[AUTH LOG] ${timestamp} - User ${userId} - ${status} - IP: ${ip || 'unknown'}`);
}

/**
 * Извлекает IP адрес из запроса
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  return forwarded?.split(',')[0] || realIP || 'unknown';
}