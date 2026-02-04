/**
 * Универсальный запрос на вход от любого провайдера (Telegram, VK ID и т.д.).
 * Используется для создания/обновления записей в tclients и tclients_auth и выдачи JWT.
 */
export interface UserAuthRequest {
  auth_type: 'telegram' | 'vkid' | 'yandex';
  auth_id: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  /** Сырой контекст провайдера для auth_context и additional_info в БД */
  raw_context?: unknown;
}
