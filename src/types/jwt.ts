// Типы для JWT токенов
export interface JWTPayload {
  userId: number;
  role: string;
  authId: string;
  providerId?: number; // Опциональный ID провайдера для роли 'provider'
}

export interface RefreshTokenPayload {
  userId: number;
  authId: string;
  tokenId: string;
}
