import {ClientService} from './ClientService';
import {ProviderService} from './ProviderService';
import {generateJWT, generateRefreshToken} from '@/lib/auth/auth-utils';
import {TelegramUserData} from '@/types/telegram';

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
  private providerService: ProviderService;

  constructor() {
    this.clientService = new ClientService();
    this.providerService = new ProviderService();
  }

  /**
   * Аутентификация пользователя через Telegram
   */
  async authenticateWithTelegram(telegramUser: TelegramUserData): Promise<{ user: AuthUser; tokens: AuthTokens } | null> {
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
  private generateTokens(userId: number, role: string, authId: string, providerId?: number): AuthTokens {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    return {
      jwtToken: generateJWT(userId, role, authId, providerId),
      refreshToken: generateRefreshToken(userId, authId),
      expiresAt
    };
  }

  /**
   * Переключение клиента на роль провайдера
   */
  async authProvider(userId: number, authId: string): Promise<{ user: AuthUser; tokens: AuthTokens } | null> {
    try {
      // Проверяем, что у клиента существует бизнес-аккаунт
      const provider = await this.providerService.getProviderForClient(userId);
      if (!provider) {
        throw new Error('У клиента нет бизнес-аккаунта');
      }

      // Получаем клиента с аутентификацией
      const clientWithAuth = await this.clientService.findByIdWithActiveAuth(userId, authId);
      if (!clientWithAuth || !clientWithAuth.tclients_auth.length) {
        throw new Error('Клиент не найден или не имеет аутентификации');
      }

      // Находим активную аутентификацию
      const activeAuth =
          clientWithAuth.tclients_auth.find(auth => auth.auth_id === authId);
      
      if (!activeAuth) {
        throw new Error('Активная аутентификация не найдена');
      }

      // Обновляем роль на 'provider'
      const updatedClient = await this.clientService.updateAuthRole(userId, activeAuth.id, 'provider');

      if (!updatedClient) {
        throw new Error('Не удалось обновить роль клиента');
      }

      // Генерируем новые токены с ролью 'provider' и providerId
      const tokens = this.generateTokens(userId, 'provider', authId, provider.id);
      
      // Обновляем refresh token в БД
      await this.clientService.updateRefreshToken(authId, tokens.refreshToken, tokens.expiresAt);

      const user: AuthUser = {
        id: updatedClient.id,
        name: updatedClient.name,
        role: 'provider',
        telegram_id: activeAuth.auth_id ? parseInt(activeAuth.auth_id.replace('telegram_', '')) : 0,
        username: undefined // Можно добавить получение username из telegram данных
      };

      return { user, tokens };
    } catch (error) {
      console.error('Error switching to provider role:', error);
      return null;
    }
  }
} 