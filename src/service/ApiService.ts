import {ValidatedTelegramUserDataResponse} from "@/types/telegram";

export const ApiService = {

  async validateTelegramInitData(initData: string) : Promise<ValidatedTelegramUserDataResponse> {
    const response = await fetch('/api/auth/login/telegram/init-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData: initData }),
    });

    if(!response.ok) {
      throw new Error('Ошибка валидации `initData` telegram пользователя');
    }

    return await response.json();
  }

}