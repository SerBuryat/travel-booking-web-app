import jwt, {Secret} from 'jsonwebtoken';
import {StringValue} from "ms";

// Конфигурация JWT
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: StringValue = '1h';
const REFRESH_TOKEN_EXPIRES_IN: StringValue = '7d';

// Интерфейсы для типизации
interface JWTPayload {
  userId: number;
  role: string;
  authId: string;
}

interface RefreshTokenPayload {
  userId: number;
  authId: string;
  tokenId: string;
}

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
export function generateJWT(userId: number, role: string, authId: string): string {
  const payload: JWTPayload = {
    userId,
    role,
    authId,
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

/**
 * Обновляет JWT токен используя refresh токен
 */
export function refreshJWT(refreshToken: string, userRole?: string): { newJWT: string; newRefreshToken: string } | null {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return null;
  }

  // Генерируем новые токены
  const newJWT = generateJWT(decoded.userId, userRole || 'user', decoded.authId);
  const newRefreshToken = generateRefreshToken(decoded.userId, decoded.authId);

  return {
    newJWT,
    newRefreshToken,
  };
}

/**
 * Декодирует JWT токен без валидации
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * Декодирует refresh токен без валидации
 */
export function decodeRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.decode(token) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token decode error:', error);
    return null;
  }
}

/**
 * Проверяет, истек ли JWT токен
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
} 