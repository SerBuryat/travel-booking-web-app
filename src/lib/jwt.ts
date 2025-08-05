import jwt, {Secret} from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import {StringValue} from "ms";

// Конфигурация JWT
const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'your-secret-key-change-in-production');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as StringValue; // 1 час
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue; // 7 дней

// Типы для JWT payload
export interface JWTPayload extends jwt.JwtPayload {
  userId: number;
  role: string;
  authId: string;
}

export interface RefreshTokenPayload extends jwt.JwtPayload {
  userId: number;
  authId: string;
  tokenId: string;
}

/**
 * Генерирует JWT токен для пользователя
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
 * Генерирует refresh токен
 */
export function generateRefreshToken(userId: number, authId: string): string {
  const tokenId = randomBytes(32).toString('hex');
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
export function validateJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT validation error:', error);
    return null;
  }
}

/**
 * Валидирует refresh токен
 */
export function validateRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token validation error:', error);
    return null;
  }
}

/**
 * Обновляет JWT токен используя refresh токен
 */
export function refreshJWT(refreshToken: string, userRole?: string): { newJWT: string; newRefreshToken: string } | null {
  const decoded = validateRefreshToken(refreshToken);
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
 * Извлекает данные из JWT токена без валидации (для отладки)
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