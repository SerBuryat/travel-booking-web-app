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
      photo: telegramData.photo_url,
      additional_info: this.buildAdditionalInfo(telegramData)
    };
  }

  /**
   * Построить данные для обновления клиента
   */
  static buildClientUpdateData(telegramData: TelegramUser): UpdateClientType {
    return {
      name: this.buildFullName(telegramData),
      photo: telegramData.photo_url,
      additional_info: this.buildAdditionalInfo(telegramData)
    };
  }

  /**
   * Построить данные для создания аутентификации
   */
  static buildAuthCreateData(
    authId: string,
    telegramData: TelegramUser,
    tokenExpiresAt: Date
  ): CreateClientAuthType {
    return {
      auth_type: 'telegram',
      auth_id: authId,
      auth_context: telegramData,
      refresh_token: '',
      token_expires_at: tokenExpiresAt,
      role: 'user'
    };
  }
} 