/**
 * Application route constants
 * Centralized route definitions to avoid hardcoded strings
 */

export const PAGE_ROUTES = {
  // Authentication routes
  TELEGRAM_AUTH: '/login/telegram',
  WEB_AUTH: '/login/web',
  /** OAuth callback: Yandex (и др.) редиректят сюда с code — страница должна быть доступна без JWT */
  YANDEX_CALLBACK: '/login/yandex/callback',
  /** OAuth callback: Google */
  GOOGLE_CALLBACK: '/login/google/callback',
  
  // Main pages
  HOME: '/home',
  IN_PROGRESS: '/in-progress',
  PROFILE: '/profile',
  REQUESTS: '/requests',
  MAP: '/map',
  // todo - можно сделать `/error` с параметрами с какой страницы и по какой причине ошибка,
  //  чтобы показать информативную ошибку пользователю
  ERROR: '/error',
  
  // Service routes
  SERVICES: {
    REGISTRATION: '/services/registration'
  },
  
  // Provider routes
  PROVIDER: {
    SERVICES: '/provider/services',
    CREATE_SERVICE: '/provider/services/create',
    PROFILE: '/provider/profile',
    REQUESTS: '/provider/requests'
  },
  
  // Catalog routes
  CATALOG: {
    ROOT: '/catalog',
    RESULT: '/catalog/result',
    POPULAR: '/catalog/popular',
    AFISHA_POPULAR: '/catalog/afisha/popular',
    CATEGORY: '/catalog/[categoryId]',
    CATEGORY_SERVICES: '/catalog/[categoryId]/services'
  },
  
  // Profile sub-routes
  PROFILE_ORDERS: '/profile/orders'
} as const;
