/**
 * Получает данные инициализации из URL хэша Telegram Web App
 * @returns Объект с данными авторизации или ошибкой
 */
export const getInitData = (): { data: string | null; error: string | null } => {
  try {
    const hash = window.location.hash;
    
    // Проверяем, есть ли хэш в URL
    if (!hash || !hash.startsWith('#')) {
      return {
        data: null,
        error: 'Отсутствуют данные авторизации в URL. Убедитесь, что вы перешли из Telegram Mini App.'
      };
    }

    const rawUserDataFromTgHash = hash.substring(1);
    if (!rawUserDataFromTgHash) {
      return {
        data: null,
        error: 'URL содержит пустые данные авторизации. Попробуйте перейти из Telegram Mini App снова.'
      };
    }
    
    const params = new URLSearchParams(rawUserDataFromTgHash);
    const tgWebAppData = params.get('tgWebAppData');
    
    if (!tgWebAppData) {
      return {
        data: null,
        error: 'Не найдены данные Telegram Web App. Убедитесь, что вы используете правильную ссылку из Telegram.'
      };
    }

    return { data: tgWebAppData, error: null };
  } catch (error) {
    console.error('Error getting tgWebAppData from hash:', error);
    return {
      data: null,
      error: 'Произошла ошибка при обработке данных авторизации. Попробуйте обновить страницу.'
    };
  }
}; 