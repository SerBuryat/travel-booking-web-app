import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateJWT, JWTPayload } from './jwt';
import { ClientService } from '../service/ClientService';
import { AuthResult, ClientWithAuthType } from '../model/ClientType';

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
 * Получает JWT токен из cookies
 */
export async function getJWTFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(JWT_COOKIE_NAME)?.value || null;
}

/**
 * Получает refresh токен из cookies
 */
export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;
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
 * Проверяет аутентификацию пользователя
 */
export async function checkAuth(): Promise<AuthResult> {
  try {
    const token = await getJWTFromCookies();
    
    if (!token) {
      return { isAuthenticated: false, error: 'No token provided' };
    }

    const payload = validateJWT(token);
    if (!payload) {
      return { isAuthenticated: false, error: 'Invalid token' };
    }

    // Используем ClientService для проверки аутентификации
    const clientService = new ClientService();
    return await clientService.checkAuth(payload.userId, payload.authId);
  } catch (error) {
    console.error('Auth check error:', error);
    return { isAuthenticated: false, error: 'Authentication error' };
  }
}

/**
 * Получает данные пользователя из токена
 */
export async function getUserFromToken(token: string): Promise<ClientWithAuthType | null> {
  try {
    const payload = validateJWT(token);
    if (!payload) {
      return null;
    }

    const clientService = new ClientService();
    return await clientService.findByIdWithActiveAuth(payload.userId, payload.authId);
  } catch (error) {
    console.error('Get user from token error:', error);
    return null;
  }
}

/**
 * Проверяет роли пользователя
 */
export function checkUserRole(user: ClientWithAuthType, requiredRoles: string[]): boolean {
  if (!user || !user.tclients_auth || user.tclients_auth.length === 0) {
    return false;
  }

  const userRole = user.tclients_auth[0].role || 'user';
  return requiredRoles.includes(userRole);
}

/**
 * Логирует попытки входа
 */
export function logLoginAttempt(userId: number, success: boolean, ip?: string): void {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'FAILED';
  
  console.log(`[AUTH LOG] ${timestamp} - User ${userId} - ${status} - IP: ${ip || 'unknown'}`);
  
  // В будущем можно добавить сохранение в БД
  // await prisma.loginLogs.create({
  //   data: {
  //     userId,
  //     success,
  //     ip,
  //     timestamp: new Date(),
  //   },
  // });
}

/**
 * Извлекает IP адрес из запроса
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

/**
 * Проверяет, является ли маршрут защищенным
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/profile', '/requests', '/admin', '/provider'];
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Проверяет, требует ли маршрут определенной роли
 */
export function getRequiredRole(pathname: string): string[] {
  if (pathname.startsWith('/admin')) {
    return ['admin'];
  }
  if (pathname.startsWith('/provider')) {
    return ['provider', 'admin'];
  }
  return ['user', 'provider', 'admin']; // Для /profile и /requests
} 