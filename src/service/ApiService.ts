import {TelegramUserInitData} from "@/types/telegram";
import {TelegramUserDataValidationResponse} from "@/service/TelegramService";
import {get, post} from "@/service/http/httpClient";
import {UserAuth} from "@/lib/auth/userAuth";

export const ApiService = {

  async validateTelegramInitData(telegramUserInitData: TelegramUserInitData) : Promise<TelegramUserDataValidationResponse> {
    return await post<TelegramUserDataValidationResponse, TelegramUserInitData>(
      '/api/auth/login/telegram/validate', telegramUserInitData
    );
  },

  async getUserAuth() : Promise<UserAuth> {
    return await get<UserAuth>('/api/auth/me');
  }

}