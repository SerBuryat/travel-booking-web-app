// Сырые данные которые передает Telegram Mini App
export interface TelegramUserInitData {
  query_id?: string;
  user: TelegramUserData;
  auth_date: number;
  signature?: string;
  hash?: string;
}

// Данные пользователя telegram
export interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}