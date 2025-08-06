import { TelegramUser } from '@/types/telegram';
import { CreateClientType, UpdateClientType, CreateClientAuthType } from '@/model/ClientType';

export class TelegramDataBuilder {
  /**
   * Построить полное имя пользователя
   */
  static buildFullName(telegramData: TelegramUser): string {
    return telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : '');
  }

  /**
   * Построить дополнительную информацию
   */
  static buildAdditionalInfo(telegramData: TelegramUser): any {
    return {
      telegram_id: telegramData.id,
      username: telegramData.username,
      language_code: telegramData.language_code,
      ...telegramData
    };
  }

  /**
   * Построить данные для создания клиента
   */
  static buildClientCreateData(telegramData: TelegramUser): CreateClientType {
    return {
      name: this.buildFullName(telegramData),
      additional_info: this.buildAdditionalInfo(telegramData)
    };
  }

  /**
   * Построить данные для обновления клиента
   */
  static buildClientUpdateData(telegramData: TelegramUser): UpdateClientType {
    return {
      name: this.buildFullName(telegramData),
      additional_info: this.buildAdditionalInfo(telegramData)
    };
  }

  /**
   * Построить данные для создания аутентификации
   */
  static buildAuthCreateData(
    clientId: number,
    authId: string,
    telegramData: TelegramUser,
    tokenExpiresAt: Date
  ): CreateClientAuthType {
    return {
      tclients_id: clientId,
      auth_type: 'telegram',
      auth_id: authId,
      auth_context: telegramData,
      refresh_token: '',
      token_expires_at: tokenExpiresAt,
      role: 'user'
    };
  }
} 