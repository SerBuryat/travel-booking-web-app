import {TelegramUserInitData} from "@/types/telegram";

/**
 * Получает данные клиента из хэша (`window.location.hash`) при переходе из Telegram Mini App
 * https://docs.telegram-mini-apps.com/platform/init-data
 * см. docs/help/telegram/telegram-user-init-data.md
 *
 * @returns { data: TelegramUserInitData } - данные клиента в формате TelegramUserInitData
 * @throws { Error } - ошибка при получении данных из Telegram (отсутствуют данные в URL, пустые данные в URL, не
 * найдены данные в tgWebAppData)
 * @param rawHashData
 */
export function getInitData(rawHashData: string) : TelegramUserInitData {
  // Проверяем, есть ли хэш в URL
  if (!rawHashData || !rawHashData.startsWith('#')) {
    throw new Error(
        'Отсутствует `initData` пользователя в URL. Убедитесь, что вы перешли из Telegram Mini App.'
    );
  }

  // Проверяем, есть ли данные в хэше
  const rawUserDataFromTgHash = rawHashData.substring(1);
  if (!rawUserDataFromTgHash) {
    throw new Error(
        'URL содержит пустые `initData` пользователя. Попробуйте перейти из Telegram Mini App снова.'
    );
  }

  // Получаем данные из хэша
  const params = new URLSearchParams(rawUserDataFromTgHash);
  const rawInitData = params.get('tgWebAppData');

  // Проверяем, есть ли данные в `rawInitData`(`tgWebAppData`)
  if (!rawInitData) {
    throw new Error(
        'Не найдены данные Telegram Web App. Убедитесь, что вы используете правильную ссылку из Telegram.'
    );
  }

  // Получаем данные пользователя из rawInitData
  const urlParams = new URLSearchParams(rawInitData);
  const userData = urlParams.get('user');

  if (!userData) {
    throw new Error('Не найдены данные пользователя в `initData`.');
  }

  const authDate = urlParams.get('auth_date');
  if (!authDate) {
    throw new Error('Не найдены данные времени авторизации в `initData`.');
  }

  const signature = urlParams.get('signature');
  if (!signature) {
    throw new Error('Не найдены данные подписи в `initData`.');
  }
  
  const hash = urlParams.get('hash');
  if (!hash) {
    throw new Error('Не найдены данные хеша в `initData`.');
  }

  // Парсим данные пользователя из URL-encoded JSON с правильным типом
  const parsedUserData = JSON.parse(decodeURIComponent(userData));

  // Создаем объект TelegramInitData с правильным типом
  return {
    initData: rawInitData,
    user: parsedUserData,
    authDate: parseInt(authDate),
    signature: signature,
    hash: hash
  };
}