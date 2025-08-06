import { ClientService } from './ClientService';
import { generateJWT, generateRefreshToken } from '@/lib/jwt';
import { TelegramUser } from '@/types/telegram';

export interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface AuthUser {
  id: number;
  name: string;
  role: string;
  telegram_id: number;
  username?: string;
}

export class AuthService {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  /**
   * Аутентификация пользователя через Telegram
   */
  async authenticateWithTelegram(telegramUser: TelegramUser): Promise<{ user: AuthUser; tokens: AuthTokens } | null> {
    try {
      const authId = `telegram_${telegramUser.id}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Создаем или обновляем пользователя
      const clientWithAuth = await this.clientService.createOrUpdateWithTelegramAuth(
        telegramUser,
        authId,
        expiresAt
      );

      if (!clientWithAuth || !clientWithAuth.tclients_auth.length) {
        return null;
      }

      const auth = clientWithAuth.tclients_auth[0];
      
      // Генерируем токены
      const tokens = this.generateTokens(clientWithAuth.id, auth.role || 'user', authId);
      
      // Обновляем refresh token в БД
      await this.clientService.updateRefreshToken(authId, tokens.refreshToken, tokens.expiresAt);

      const user: AuthUser = {
        id: clientWithAuth.id,
        name: clientWithAuth.name,
        role: auth.role || 'user',
        telegram_id: telegramUser.id,
        username: telegramUser.username
      };

      return { user, tokens };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  /**
   * Генерация JWT токенов
   */
  private generateTokens(userId: number, role: string, authId: string): AuthTokens {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    return {
      jwtToken: generateJWT(userId, role, authId),
      refreshToken: generateRefreshToken(userId, authId),
      expiresAt
    };
  }
} 