import {TelegramUserInitData} from "@/types/telegram";
import {UserAuth} from "@/app/api/auth/me/route";
import {TelegramUserDataValidationResponse} from "@/service/TelegramService";

export const ApiService = {

  async validateTelegramInitData(telegramUserInitData: TelegramUserInitData) : Promise<TelegramUserDataValidationResponse> {
    const response = await fetch('/api/auth/login/telegram/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramUserInitData),
    });

    if(!response.ok) {
      const { error } = await response.json();
      throw new Error(`Ошибка валидации 'initData' telegram пользователя. ${error}`);
    }

    return await response.json();
  },

  async loginWithTelegramUserData(telegramUserInitData: TelegramUserInitData) : Promise<UserAuth> {
    const response = await fetch('/api/auth/login/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramUserInitData),
    });

    if(!response.ok) {
      const { error } = await response.json();
      throw new Error(`Ошибка аутентификации telegram пользователя. ${error}`);
    }

    return await response.json();
  }

}