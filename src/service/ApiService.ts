import {TelegramUserInitData} from "@/types/telegram";
import {TelegramUserDataValidationResponse} from "@/service/TelegramService";
import {post} from "@/service/http/httpClient";

export const ApiService = {

  async validateTelegramInitData(telegramUserInitData: TelegramUserInitData) : Promise<TelegramUserDataValidationResponse> {
    return await post<TelegramUserDataValidationResponse, TelegramUserInitData>(
      '/api/auth/login/telegram/validate', telegramUserInitData
    );
  }

}