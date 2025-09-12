import {ClientService} from './ClientService';
import {AuthTokens, generateJWT, generateRefreshToken, generateTokens} from '@/lib/auth/authUtils';
import {TelegramUserData} from '@/types/telegram';

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

  async authenticateWithTelegram(telegramUser: TelegramUserData): Promise<{ user: AuthUser; tokens: AuthTokens } | null> {
    try {
      const authId = `telegram_${telegramUser.id}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Создаем или обновляем пользователя
      const clientWithAuth = await this.clientService.createOrUpdateWithTelegramAuth(
        telegramUser, authId, expiresAt
      );

      if (!clientWithAuth || !clientWithAuth.tclients_auth.length) {
        return null;
      }

      const auth = clientWithAuth.tclients_auth[0];

      // Генерируем токены
      const tokens = generateTokens(clientWithAuth.id, auth.role || 'user', auth.id);

      // Обновляем refresh token в БД
      await this.clientService.updateRefreshToken(auth.id, tokens.refreshToken, tokens.expiresAt);

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

} 