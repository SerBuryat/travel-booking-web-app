import {TelegramUserInitData} from "@/types/telegram";
import {UserAuth} from "@/app/api/auth/me/route";
import {TelegramUserDataValidationResponse} from "@/service/TelegramService";
import {get, post} from "@/service/http/httpClient";

export const ApiService = {

  async validateTelegramInitData(telegramUserInitData: TelegramUserInitData) : Promise<TelegramUserDataValidationResponse> {
    return await post<TelegramUserDataValidationResponse, TelegramUserInitData>(
      '/api/auth/login/telegram/validate', telegramUserInitData
    );
  },

  async loginWithTelegramUserData(telegramUserInitData: TelegramUserInitData) : Promise<UserAuth> {
    return await post<UserAuth, TelegramUserInitData>(
      '/api/auth/login/telegram', telegramUserInitData
    );
  },

  async getUserAuth() : Promise<UserAuth> {
    return await get<UserAuth>('/api/auth/me');
  }

}