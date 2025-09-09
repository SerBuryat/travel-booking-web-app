import { TelegramUserInitData } from "@/types/telegram";

/**
 * Получает данные клиента из хэша (`window.location.hash`) при переходе из Telegram Mini App
 * https://docs.telegram-mini-apps.com/platform/init-data
 * см. docs/help/telegram/telegram-user-init-data.md
 *
 * @returns { data: TelegramUserInitData } - данные клиента в формате TelegramUserInitData
 * @throws { TelegramInitDataError } - ошибка при получении данных из Telegram (отсутствуют данные в URL, пустые данные в URL, не найдены данные в tgWebAppData)
 * @param windowsLocationHash
 */
export const getInitData = (windowsLocationHash: string) : TelegramUserInitData => {
  // Проверяем, есть ли хэш в URL
  if (!windowsLocationHash || !windowsLocationHash.startsWith('#')) {
    throw new TelegramInitDataError(
        'Отсутствуют данные `initData` пользователя в URL. Убедитесь, что вы перешли из Telegram Mini App.'
    );
  }

  // Проверяем, есть ли данные в хэше
  const rawUserDataFromTgHash = windowsLocationHash.substring(1);
  if (!rawUserDataFromTgHash) {
    throw new TelegramInitDataError(
        'URL содержит пустые `initData` пользователя. Попробуйте перейти из Telegram Mini App снова.'
    );
  }

  // Получаем данные из хэша
  const params = new URLSearchParams(rawUserDataFromTgHash);
  const initData = params.get('tgWebAppData');

  // Проверяем, есть ли данные в initData
  if (!initData) {
    throw new TelegramInitDataError(
        'Не найдены данные Telegram Web App. Убедитесь, что вы используете правильную ссылку из Telegram.'
    );
  }

  // Получаем данные пользователя из initData
  const urlParams = new URLSearchParams(initData);
  const userData = urlParams.get('user');

  if (!userData) {
    throw new TelegramInitDataError(
        'Не найдены данные пользователя в Telegram Web App.'
    );
  }

  const authDate = urlParams.get('auth_date');
  if (!authDate) {
    throw new TelegramInitDataError(
        'Не найдены данные о времени авторизации в Telegram Web App.'
    );
  }

  const signature = urlParams.get('signature');
  if (!signature) {
    throw new TelegramInitDataError(
        'Не найдены данные о подписи в Telegram Web App.'
    );
  }
  
  const hash = urlParams.get('hash');
  if (!hash) {
    throw new TelegramInitDataError(
        'Не найдены данные о хеше в Telegram Web App.'
    );
  }

  // Парсим данные пользователя из URL-encoded JSON с правильным типом
  const parsedUserData = JSON.parse(decodeURIComponent(userData));

  // Создаем объект TelegramInitData с правильным типом
  const telegramInitData: TelegramUserInitData = {
    initData: initData,
    user: parsedUserData,
    auth_date: parseInt(authDate),
    signature: signature,
    hash: hash
  };

  return telegramInitData;
}

// Класс для ошибки при получении данных из Telegram через хэш
class TelegramInitDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TelegramInitDataError';
  }
}