import jwt, {Secret} from 'jsonwebtoken';
import {StringValue} from "ms";
import { JWTPayload, RefreshTokenPayload } from '@/types/jwt';

// Конфигурация JWT
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: StringValue = '1d';
const REFRESH_TOKEN_EXPIRES_IN: StringValue = '14d';

/**
 * Генерирует случайные байты для токена (Web Crypto API)
 */
function generateRandomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Генерирует JWT токен
 */
export function generateJWT(userId: number, role: string, authId: string, providerId?: number): string {
  const payload: JWTPayload = {
    userId,
    role,
    authId,
    ...(providerId && { providerId }), // Добавляем providerId только если он передан
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Генерирует refresh токен с оптимизированным размером
 */
export function generateRefreshToken(userId: number, authId: string): string {
  // Используем 16 байт вместо 32 для уменьшения размера
  const tokenId = generateRandomBytes(16);
  const payload: RefreshTokenPayload = {
    userId,
    authId,
    tokenId,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

/**
 * Валидирует JWT токен
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Валидирует refresh токен
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token verification error:', error);
    return null;
  }
}