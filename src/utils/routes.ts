/**
 * Application route constants
 * Centralized route definitions to avoid hardcoded strings
 */

export const PAGE_ROUTES = {
  // Authentication routes
  TELEGRAM_AUTH: '/login/telegram',
  
  // Main pages
  HOME: '/',
  PROFILE: '/profile',
  REQUESTS: '/requests',
  MAP: '/map',
  
  // Service routes
  SERVICES: {
    REGISTRATION: '/services/registration'
  },
  
  // Provider routes
  PROVIDER: {
    SERVICES: '/provider/services',
    PROFILE: '/provider/profile'
  },
  
  // Catalog routes
  CATALOG: {
    ROOT: '/catalog',
    RESULT: '/catalog/result'
  },
  
  // Profile sub-routes
  PROFILE_ORDERS: '/profile/orders'
} as const;
