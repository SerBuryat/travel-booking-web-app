// Типы для данных пользователя из Telegram Mini App

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramInitData {
  query_id?: string;
  user: TelegramUser;
  auth_date: number;
  signature?: string;
  hash?: string;
}

export interface TelegramAuthResponse {
  success: boolean;
  user?: TelegramUser;
  error?: string;
  details?: string;
} 