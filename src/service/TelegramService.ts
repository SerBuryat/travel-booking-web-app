import {TelegramUserInitData} from "@/types/telegram";
import {validate} from "@telegram-apps/init-data-node";

export interface TelegramUserDataValidationResponse {
  success: boolean;
  error?: string;
  details?: string;
}

export const TelegramService = {

  validateTelegramInitData(telegramUserInitData: TelegramUserInitData) : TelegramUserDataValidationResponse {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      throw new Error('Server configuration error: BOT_TOKEN not found in `.env`');
    }

    try {
      validate(telegramUserInitData.initData, botToken);
    } catch (error) {
      return {
        success: false,
        error: error as string,
        details: error instanceof Error ? error.message : 'Telegram user `initData` validation failed'
      };
    }

    return {
      success: true
    };
  }

}