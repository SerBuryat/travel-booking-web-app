'use server';

import { validate } from '@telegram-apps/init-data-node';
import {
  TelegramUserInitData,
  TelegramUserDataValidationResponse,
} from '@/types/telegram';

/**
 * Валидирует Telegram initData на сервере (подпись через BOT_TOKEN).
 * Вызывается из клиента как server action и из authWithTelegram.
 */
export async function validateTelegramInitData(
  telegramUserInitData: TelegramUserInitData
): Promise<TelegramUserDataValidationResponse> {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    throw new Error('Server configuration error: BOT_TOKEN not found in `.env`');
  }

  try {
    validate(telegramUserInitData.initData, botToken);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error as string,
      details:
        error instanceof Error
          ? error.message
          : 'Telegram user `initData` validation failed',
    };
  }
}
